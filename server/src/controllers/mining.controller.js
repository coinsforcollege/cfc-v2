import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import College from '../models/College.js';
import { broadcastMiningUpdate } from '../websocket/miningSocket.js';
import { createNotification, checkTokenMilestone, checkAdminTokenMilestone, notifyAdminAboutTokenMilestone } from '../services/notification.service.js';
import { REFERRAL_LIMIT_PER_COLLEGE, getCappedReferralCount, calculateReferralBonus } from '../utils/referrals.js';

// @desc    Start mining for a college
// @route   POST /api/mining/start/:collegeId
// @access  Private (User only)
export const startMining = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    // First, auto-stop any expired sessions for this user
    const now = new Date();
    const expiredSessions = await MiningSession.find({
      user: userId,
      isActive: true,
      endTime: { $lte: now }
    });

    // Stop expired sessions
    for (const session of expiredSessions) {
      const miningDuration = (session.endTime - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      // Atomically mark session inactive - only if STILL active
      // This prevents multiple processes from stopping the same session
      const updatedSession = await MiningSession.findOneAndUpdate(
        {
          _id: session._id,
          isActive: true
        },
        {
          $set: {
            isActive: false,
            tokensEarned: tokensEarned
          }
        },
        { new: false }
      );

      // If null, another process already stopped this session - skip wallet/stats updates
      if (!updatedSession) {
        continue;
      }

      // We successfully stopped the session - proceed with wallet and stats updates
      await Wallet.findOneAndUpdate(
        { user: session.user, college: session.college },
        {
          $inc: {
            balance: tokensEarned,
            totalMined: tokensEarned
          },
          lastUpdated: now
        },
        { upsert: true }
      );

      // Decrement activeMiners by 1 (we know this session was active)
      await College.findByIdAndUpdate(session.college, {
        $inc: {
          'stats.activeMiners': -1,
          'stats.totalTokensMined': tokensEarned
        }
      });
    }

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if user has this college in their mining list
    const user = await User.findById(userId);
    const hasCollege = user.userProfile.miningColleges.some(
      mc => mc.college.toString() === collegeId
    );

    if (!hasCollege) {
      return res.status(400).json({
        success: false,
        message: 'You must add this college to your mining list first'
      });
    }

    // Check if already mining for this college (active AND unexpired session)
    const existingSession = await MiningSession.findOne({
      user: userId,
      college: collegeId,
      isActive: true,
      endTime: { $gt: now }
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'You are already mining for this college'
      });
    }

    // Calculate earning rate: base rate + per-college referral bonus
    const baseRate = college.baseRate || 0.25;
    const referralBonusRate = college.referralBonusRate || 0.1;

    // Count active referrals for this specific college
    const miningCollege = user.userProfile.miningColleges.find(
      mc => mc.college.toString() === collegeId
    );

    // Calculate referral bonus: number of referred users * bonus rate per referral
    // Cap at 10 referrals per college for bonus calculation
    const totalReferrals = miningCollege?.referredUsers?.length || 0;
    const activeReferrals = getCappedReferralCount(miningCollege?.referredUsers);
    const referralBonus = calculateReferralBonus(totalReferrals, referralBonusRate);

    const earningRate = baseRate + referralBonus;

    console.log(`\n=== EARNING RATE CALCULATION ===`);
    console.log(`College: ${college.name}`);
    console.log(`User: ${user.name}`);
    console.log(`Base Rate: ${baseRate} t/h`);
    console.log(`Total Referrals: ${totalReferrals} (capped at ${activeReferrals} for bonus)`);
    console.log(`Referral Bonus Rate: ${referralBonusRate} t/h per referral`);
    console.log(`Total Referral Bonus: ${referralBonus} t/h`);
    console.log(`Final Earning Rate: ${earningRate} t/h`);
    console.log(`================================\n`);

    // Create new mining session (24 hours)
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const miningSession = await MiningSession.create({
      user: userId,
      college: collegeId,
      startTime,
      endTime,
      earningRate,
      isActive: true,
      lastCalculatedAt: startTime
    });

    // Create or get wallet for this user-college pair
    let wallet = await Wallet.findOne({ user: userId, college: collegeId });
    const isFirstTime = !wallet;
    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        college: collegeId,
        balance: 0,
        totalMined: 0
      });
    }

    // Update college stats
    const statsUpdate = { 'stats.activeMiners': 1 };
    if (isFirstTime) {
      // If this is the first time this user is mining for this college, increment totalMiners
      statsUpdate['stats.totalMiners'] = 1;
    }
    await College.findByIdAndUpdate(collegeId, {
      $inc: statsUpdate
    });

    res.status(201).json({
      success: true,
      message: 'Mining started successfully',
      data: {
        session: miningSession,
        wallet
      }
    });

    // Broadcast mining update via WebSocket
    await broadcastMiningUpdate(userId);
  } catch (error) {
    next(error);
  }
};

// @desc    Start mining for all available colleges
// @route   POST /api/mining/start-all
// @access  Private (User only)
export const startAllMining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Get user's mining colleges
    const user = await User.findById(userId);
    if (!user || !user.userProfile || !user.userProfile.miningColleges) {
      return res.status(400).json({
        success: false,
        message: 'No mining colleges found'
      });
    }

    const miningColleges = user.userProfile.miningColleges;
    let startedCount = 0;
    const results = [];

    // First, auto-stop any expired sessions for this user (same logic as startMining)
    const expiredSessions = await MiningSession.find({
      user: userId,
      isActive: true,
      endTime: { $lte: now }
    });

    for (const session of expiredSessions) {
      const miningDuration = (session.endTime - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      const updatedSession = await MiningSession.findOneAndUpdate(
        { _id: session._id, isActive: true },
        { $set: { isActive: false, tokensEarned: tokensEarned } },
        { new: false }
      );

      if (updatedSession) {
        await Wallet.findOneAndUpdate(
          { user: session.user, college: session.college },
          { $inc: { balance: tokensEarned, totalMined: tokensEarned }, lastUpdated: now },
          { upsert: true }
        );
        await College.findByIdAndUpdate(session.college, {
          $inc: { 'stats.activeMiners': -1, 'stats.totalTokensMined': tokensEarned }
        });
      }
    }

    // Now iterate through all colleges and start mining if not already active
    for (const mc of miningColleges) {
      const collegeId = mc.college.toString();

      // Check if already mining for this college
      const existingSession = await MiningSession.findOne({
        user: userId,
        college: collegeId,
        isActive: true,
        endTime: { $gt: now }
      });

      if (existingSession) {
        results.push({ collegeId, status: 'already_active' });
        continue;
      }

      // Get college details for rates
      const college = await College.findById(collegeId);
      if (!college) continue;

      // Calculate rates (reusing logic from startMining)
      const baseRate = college.baseRate || 0.25;
      const referralBonusRate = college.referralBonusRate || 0.1;
      const totalReferrals = mc.referredUsers?.length || 0;
      const activeReferrals = getCappedReferralCount(mc.referredUsers);
      const referralBonus = calculateReferralBonus(totalReferrals, referralBonusRate);
      const earningRate = baseRate + referralBonus;

      // Create session
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

      await MiningSession.create({
        user: userId,
        college: collegeId,
        startTime,
        endTime,
        earningRate,
        isActive: true,
        lastCalculatedAt: startTime
      });

      // Ensure wallet exists
      let wallet = await Wallet.findOne({ user: userId, college: collegeId });
      const isFirstTime = !wallet;
      if (!wallet) {
        await Wallet.create({
          user: userId,
          college: collegeId,
          balance: 0,
          totalMined: 0
        });
      }

      // Update college stats
      const statsUpdate = { 'stats.activeMiners': 1 };
      if (isFirstTime) statsUpdate['stats.totalMiners'] = 1;
      await College.findByIdAndUpdate(collegeId, { $inc: statsUpdate });

      startedCount++;
      results.push({ collegeId, status: 'started' });
    }

    res.status(200).json({
      success: true,
      message: `Started mining for ${startedCount} colleges`,
      data: {
        startedCount,
        results
      }
    });

    if (startedCount > 0) {
      await broadcastMiningUpdate(userId);
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Stop mining for a college (manual stop or auto after 24h)
// @route   POST /api/mining/stop/:collegeId
// @access  Private (User only)
export const stopMining = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    // Find active mining session
    const session = await MiningSession.findOne({
      user: userId,
      college: collegeId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'No active mining session found for this college'
      });
    }

    // Defense-in-depth: Explicitly validate session belongs to authenticated user
    if (session.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Session does not belong to you'
      });
    }

    // Calculate tokens earned
    const now = new Date();
    const miningDuration = (now - session.startTime) / (1000 * 60 * 60); // in hours
    const tokensEarned = miningDuration * session.earningRate;

    // Log calculation details for debugging
    console.log(`\n=== STOP MINING CALCULATION ===`);
    console.log(`User: ${userId}`);
    console.log(`College: ${collegeId}`);
    console.log(`Start Time: ${session.startTime.toISOString()}`);
    console.log(`Stop Time (now): ${now.toISOString()}`);
    console.log(`Mining Duration: ${miningDuration.toFixed(8)} hours`);
    console.log(`Earning Rate: ${session.earningRate} t/h`);
    console.log(`Tokens Earned: ${tokensEarned.toFixed(8)} tokens`);
    console.log(`Tokens Earned (rounded): ${tokensEarned.toFixed(4)} tokens`);
    console.log(`===============================\n`);

    // Atomically mark session inactive - only if STILL active
    // This prevents multiple processes from stopping the same session
    const updatedSession = await MiningSession.findOneAndUpdate(
      {
        _id: session._id,
        isActive: true
      },
      {
        $set: {
          isActive: false,
          tokensEarned: tokensEarned,
          endTime: now
        }
      },
      { new: false }
    );

    if (!updatedSession) {
      // Session was already stopped by another process
      return res.status(400).json({
        success: false,
        message: 'Session was already stopped'
      });
    }

    // Find wallet and validate ownership before updating
    let wallet = await Wallet.findOne({ user: userId, college: collegeId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Defense-in-depth: Explicitly validate wallet belongs to authenticated user
    if (wallet.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Wallet does not belong to you'
      });
    }

    // Update wallet
    const previousBalance = wallet.balance;
    wallet.balance += tokensEarned;
    wallet.totalMined += tokensEarned;
    wallet.lastUpdated = now;
    await wallet.save();

    // Get college for notification (with admin)
    const college = await College.findById(collegeId).select('name admin stats');
    const previousTotalTokens = college.stats.totalTokensMined || 0;

    // Update college stats - decrement activeMiners by 1 (we know this session was active)
    await College.findByIdAndUpdate(collegeId, {
      $inc: {
        'stats.activeMiners': -1,
        'stats.totalTokensMined': tokensEarned
      }
    });

    // Create mining completion notification
    await createNotification({
      recipient: userId,
      type: 'mining_completed',
      title: 'Mining session completed!',
      message: `You earned ${tokensEarned.toFixed(2)} tokens from ${college?.name || 'your college'}. Keep mining to earn more!`,
      data: {
        collegeId,
        collegeName: college?.name,
        tokensEarned: parseFloat(tokensEarned.toFixed(2)),
        sessionDuration: miningDuration
      },
      category: 'mining',
      priority: 'medium',
      actionUrl: '/user/colleges'
    });

    // Check for token milestone
    const milestone = await checkTokenMilestone(userId, collegeId, wallet.balance);
    if (milestone) {
      await createNotification({
        recipient: userId,
        type: 'token_milestone',
        title: `${milestone.toLocaleString()} tokens milestone!`,
        message: `Congratulations! You've mined ${milestone.toLocaleString()} tokens for ${college?.name || 'your college'}. Keep up the great work!`,
        data: {
          collegeId,
          collegeName: college?.name,
          milestone,
          totalBalance: wallet.balance
        },
        category: 'milestone',
        priority: 'high',
        actionUrl: '/user/colleges'
      });
    }

    // Check for admin token milestone (college total tokens)
    if (college.admin) {
      const newTotalTokens = previousTotalTokens + tokensEarned;
      const adminMilestone = checkAdminTokenMilestone(newTotalTokens, previousTotalTokens);
      if (adminMilestone) {
        await notifyAdminAboutTokenMilestone(college.admin, college.name, adminMilestone);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Mining stopped successfully',
      data: {
        tokensEarned,
        wallet
      }
    });

    // Broadcast mining update via WebSocket
    await broadcastMiningUpdate(userId);
  } catch (error) {
    next(error);
  }
};

// @desc    Get mining status for all colleges user is mining
// @route   GET /api/mining/status
// @access  Private (User only)
export const getMiningStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user info
    const user = await User.findById(userId)
      .populate('userProfile.miningColleges.college', 'name country logo baseRate referralBonusRate');

    // Get all active mining sessions
    const activeSessions = await MiningSession.find({
      user: userId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get all wallets
    const wallets = await Wallet.find({ user: userId })
      .populate('college', 'name country logo baseRate referralBonusRate');

    // Calculate current tokens for each active session
    const now = new Date();
    const sessionsWithCurrentTokens = activeSessions.map(session => {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60); // in hours
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = session.endTime - now; // in milliseconds
      const remainingHours = Math.max(0, remainingTime / (1000 * 60 * 60));

      return {
        college: session.college,
        startTime: session.startTime,
        endTime: session.endTime,
        earningRate: session.earningRate,
        currentTokens: Math.max(0, currentTokens),
        remainingHours: remainingHours,
        isActive: remainingHours > 0,
        sessionId: session._id
      };
    });

    // Filter out null colleges (deleted colleges)
    const validMiningColleges = user.userProfile.miningColleges.filter(mc => mc.college !== null);
    const validWallets = wallets.filter(w => w.college !== null);

    res.status(200).json({
      success: true,
      data: {
        miningColleges: validMiningColleges,
        activeSessions: sessionsWithCurrentTokens,
        wallets: validWallets
        // Note: Earning rates are now per-college, available in each session's earningRate field
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mining status for a specific college
// @route   GET /api/mining/status/:collegeId
// @access  Private (User only)
export const getMiningStatusForCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    // Get active session for this college
    const session = await MiningSession.findOne({
      user: userId,
      college: collegeId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get wallet for this college
    const wallet = await Wallet.findOne({
      user: userId,
      college: collegeId
    }).populate('college', 'name country logo baseRate referralBonusRate');

    let sessionData = null;
    if (session) {
      const now = new Date();
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60);
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = session.endTime - now;
      const remainingHours = Math.max(0, remainingTime / (1000 * 60 * 60));

      sessionData = {
        college: session.college,
        startTime: session.startTime,
        endTime: session.endTime,
        earningRate: session.earningRate,
        currentTokens: Math.max(0, currentTokens),
        remainingHours: remainingHours,
        isActive: remainingHours > 0,
        sessionId: session._id
      };
    }

    res.status(200).json({
      success: true,
      data: {
        session: sessionData,
        wallet: wallet || null,
        canStartMining: !session || (session && sessionData && !sessionData.isActive)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-stop expired mining sessions (called by cron job)
// @route   POST /api/mining/auto-stop
// @access  Private (Internal/Admin only)
export const autoStopExpiredSessions = async (req, res, next) => {
  try {
    const now = new Date();

    // Find all active sessions that have expired
    const expiredSessions = await MiningSession.find({
      isActive: true,
      endTime: { $lte: now }
    }).populate('college', 'name admin stats');

    let stoppedCount = 0;
    for (const session of expiredSessions) {
      const miningDuration = (session.endTime - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      // Atomically mark session inactive - only if STILL active
      const updatedSession = await MiningSession.findOneAndUpdate(
        {
          _id: session._id,
          isActive: true
        },
        {
          $set: {
            isActive: false,
            tokensEarned: tokensEarned
          }
        },
        { new: false }
      );

      // If null, another process already stopped this session - skip wallet/stats updates
      if (!updatedSession) {
        continue;
      }

      // Store previous total tokens before update
      const previousTotalTokens = session.college.stats.totalTokensMined || 0;

      // We successfully stopped the session - proceed with wallet and stats updates
      const wallet = await Wallet.findOneAndUpdate(
        { user: session.user, college: session.college },
        {
          $inc: {
            balance: tokensEarned,
            totalMined: tokensEarned
          },
          lastUpdated: now
        },
        { upsert: true, new: true }
      );

      // Decrement activeMiners by 1 (we know this session was active)
      await College.findByIdAndUpdate(session.college, {
        $inc: {
          'stats.activeMiners': -1,
          'stats.totalTokensMined': tokensEarned
        }
      });

      // Create mining completion notification
      await createNotification({
        recipient: session.user,
        type: 'mining_completed',
        title: 'Mining session completed!',
        message: `You earned ${tokensEarned.toFixed(2)} tokens from ${session.college?.name || 'your college'}. Keep mining to earn more!`,
        data: {
          collegeId: session.college._id,
          collegeName: session.college?.name,
          tokensEarned: parseFloat(tokensEarned.toFixed(2)),
          sessionDuration: miningDuration
        },
        category: 'mining',
        priority: 'medium',
        actionUrl: '/user/colleges'
      });

      // Check for token milestone
      const milestone = await checkTokenMilestone(session.user, session.college._id, wallet.balance);
      if (milestone) {
        await createNotification({
          recipient: session.user,
          type: 'token_milestone',
          title: `${milestone.toLocaleString()} tokens milestone!`,
          message: `Congratulations! You've mined ${milestone.toLocaleString()} tokens for ${session.college?.name || 'your college'}. Keep up the great work!`,
          data: {
            collegeId: session.college._id,
            collegeName: session.college?.name,
            milestone,
            totalBalance: wallet.balance
          },
          category: 'milestone',
          priority: 'high',
          actionUrl: '/user/colleges'
        });
      }

      // Check for admin token milestone (college total tokens)
      if (session.college.admin) {
        const newTotalTokens = previousTotalTokens + tokensEarned;
        const adminMilestone = checkAdminTokenMilestone(newTotalTokens, previousTotalTokens);
        if (adminMilestone) {
          await notifyAdminAboutTokenMilestone(session.college.admin, session.college.name, adminMilestone);
        }
      }

      stoppedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Auto-stopped ${stoppedCount} expired mining sessions`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stop mining for all active colleges
// @route   POST /api/mining/stop-all
// @access  Private (User only)
export const stopAllMining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Find all active mining sessions for this user
    const activeSessions = await MiningSession.find({
      user: userId,
      isActive: true
    }).populate('college', 'name admin stats');

    if (activeSessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active mining sessions found'
      });
    }

    let stoppedCount = 0;
    const results = [];

    for (const session of activeSessions) {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      // Atomically mark session inactive
      const updatedSession = await MiningSession.findOneAndUpdate(
        {
          _id: session._id,
          isActive: true
        },
        {
          $set: {
            isActive: false,
            tokensEarned: tokensEarned,
            endTime: now
          }
        },
        { new: false }
      );

      if (!updatedSession) {
        continue;
      }

      // Update wallet
      const wallet = await Wallet.findOneAndUpdate(
        { user: userId, college: session.college._id },
        {
          $inc: {
            balance: tokensEarned,
            totalMined: tokensEarned
          },
          lastUpdated: now
        },
        { upsert: true, new: true }
      );

      // Update college stats
      const previousTotalTokens = session.college.stats.totalTokensMined || 0;
      await College.findByIdAndUpdate(session.college._id, {
        $inc: {
          'stats.activeMiners': -1,
          'stats.totalTokensMined': tokensEarned
        }
      });

      // Create notification
      await createNotification({
        recipient: userId,
        type: 'mining_completed',
        title: 'Mining session stopped',
        message: `You earned ${tokensEarned.toFixed(2)} tokens from ${session.college?.name || 'your college'}.`,
        data: {
          collegeId: session.college._id,
          collegeName: session.college?.name,
          tokensEarned: parseFloat(tokensEarned.toFixed(2)),
          sessionDuration: miningDuration
        },
        category: 'mining',
        priority: 'low',
        actionUrl: '/user/colleges'
      });

      // Check milestones
      const milestone = await checkTokenMilestone(userId, session.college._id, wallet.balance);
      if (milestone) {
        await createNotification({
          recipient: userId,
          type: 'token_milestone',
          title: `${milestone.toLocaleString()} tokens milestone!`,
          message: `Congratulations! You've mined ${milestone.toLocaleString()} tokens for ${session.college?.name}.`,
          data: {
            collegeId: session.college._id,
            collegeName: session.college?.name,
            milestone,
            totalBalance: wallet.balance
          },
          category: 'milestone',
          priority: 'high',
          actionUrl: '/user/colleges'
        });
      }

      if (session.college.admin) {
        const newTotalTokens = previousTotalTokens + tokensEarned;
        const adminMilestone = checkAdminTokenMilestone(newTotalTokens, previousTotalTokens);
        if (adminMilestone) {
          await notifyAdminAboutTokenMilestone(session.college.admin, session.college.name, adminMilestone);
        }
      }

      stoppedCount++;
      results.push({ collegeId: session.college._id, tokensEarned });
    }

    res.status(200).json({
      success: true,
      message: `Stopped mining for ${stoppedCount} colleges`,
      data: {
        stoppedCount,
        results
      }
    });

    if (stoppedCount > 0) {
      await broadcastMiningUpdate(userId);
    }

  } catch (error) {
    next(error);
  }
};
