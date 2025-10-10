import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import College from '../models/College.js';
import { broadcastMiningUpdate } from '../websocket/miningSocket.js';

// @desc    Start mining for a college
// @route   POST /api/mining/start/:collegeId
// @access  Private (Student only)
export const startMining = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const studentId = req.user.id;

    // First, auto-stop any expired sessions for this student
    const now = new Date();
    const expiredSessions = await MiningSession.find({
      student: studentId,
      isActive: true,
      endTime: { $lte: now }
    });

    // Stop expired sessions
    for (const session of expiredSessions) {
      const miningDuration = (session.endTime - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      session.isActive = false;
      session.tokensEarned = tokensEarned;
      await session.save();

      // Update wallet
      await Wallet.findOneAndUpdate(
        { student: session.student, college: session.college },
        {
          $inc: {
            balance: tokensEarned,
            totalMined: tokensEarned
          },
          lastUpdated: now
        }
      );

      // Update college stats
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

    // Check if student has this college in their mining list
    const student = await User.findById(studentId);
    const hasCollege = student.studentProfile.miningColleges.some(
      mc => mc.college.toString() === collegeId
    );

    if (!hasCollege) {
      return res.status(400).json({
        success: false,
        message: 'You must add this college to your mining list first'
      });
    }

    // Check if already mining for this college
    const existingSession = await MiningSession.findOne({
      student: studentId,
      college: collegeId,
      isActive: true
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
    const miningCollege = student.studentProfile.miningColleges.find(
      mc => mc.college.toString() === collegeId
    );

    // Calculate referral bonus: number of referred students * bonus rate per referral
    const activeReferrals = miningCollege?.referredStudents?.length || 0;
    const referralBonus = activeReferrals * referralBonusRate;

    const earningRate = baseRate + referralBonus;

    console.log(`\n=== EARNING RATE CALCULATION ===`);
    console.log(`College: ${college.name}`);
    console.log(`Student: ${student.name}`);
    console.log(`Base Rate: ${baseRate} t/h`);
    console.log(`Active Referrals: ${activeReferrals}`);
    console.log(`Referral Bonus Rate: ${referralBonusRate} t/h per referral`);
    console.log(`Total Referral Bonus: ${referralBonus} t/h`);
    console.log(`Final Earning Rate: ${earningRate} t/h`);
    console.log(`================================\n`);

    // Create new mining session (24 hours)
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const miningSession = await MiningSession.create({
      student: studentId,
      college: collegeId,
      startTime,
      endTime,
      earningRate,
      isActive: true,
      lastCalculatedAt: startTime
    });

    // Create or get wallet for this student-college pair
    let wallet = await Wallet.findOne({ student: studentId, college: collegeId });
    const isFirstTime = !wallet;
    if (!wallet) {
      wallet = await Wallet.create({
        student: studentId,
        college: collegeId,
        balance: 0,
        totalMined: 0
      });
    }

    // Update college stats
    const statsUpdate = { 'stats.activeMiners': 1 };
    if (isFirstTime) {
      // If this is the first time this student is mining for this college, increment totalMiners
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
    await broadcastMiningUpdate(studentId);
  } catch (error) {
    next(error);
  }
};

// @desc    Stop mining for a college (manual stop or auto after 24h)
// @route   POST /api/mining/stop/:collegeId
// @access  Private (Student only)
export const stopMining = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const studentId = req.user.id;

    // Find active mining session
    const session = await MiningSession.findOne({
      student: studentId,
      college: collegeId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'No active mining session found for this college'
      });
    }

    // Calculate tokens earned
    const now = new Date();
    const miningDuration = (now - session.startTime) / (1000 * 60 * 60); // in hours
    const tokensEarned = miningDuration * session.earningRate;

    // Log calculation details for debugging
    console.log(`\n=== STOP MINING CALCULATION ===`);
    console.log(`Student: ${studentId}`);
    console.log(`College: ${collegeId}`);
    console.log(`Start Time: ${session.startTime.toISOString()}`);
    console.log(`Stop Time (now): ${now.toISOString()}`);
    console.log(`Mining Duration: ${miningDuration.toFixed(8)} hours`);
    console.log(`Earning Rate: ${session.earningRate} t/h`);
    console.log(`Tokens Earned: ${tokensEarned.toFixed(8)} tokens`);
    console.log(`Tokens Earned (rounded): ${tokensEarned.toFixed(4)} tokens`);
    console.log(`===============================\n`);

    // Update session
    session.isActive = false;
    session.tokensEarned = tokensEarned;
    session.endTime = now;
    await session.save();

    // Update wallet
    const wallet = await Wallet.findOneAndUpdate(
      { student: studentId, college: collegeId },
      {
        $inc: {
          balance: tokensEarned,
          totalMined: tokensEarned
        },
        lastUpdated: now
      },
      { new: true }
    );

    // Update college stats
    await College.findByIdAndUpdate(collegeId, {
      $inc: {
        'stats.activeMiners': -1,
        'stats.totalTokensMined': tokensEarned
      }
    });

    res.status(200).json({
      success: true,
      message: 'Mining stopped successfully',
      data: {
        tokensEarned,
        wallet
      }
    });

    // Broadcast mining update via WebSocket
    await broadcastMiningUpdate(studentId);
  } catch (error) {
    next(error);
  }
};

// @desc    Get mining status for all colleges student is mining
// @route   GET /api/mining/status
// @access  Private (Student only)
export const getMiningStatus = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get student info
    const student = await User.findById(studentId)
      .populate('studentProfile.miningColleges.college', 'name country logo baseRate referralBonusRate');

    // Get all active mining sessions
    const activeSessions = await MiningSession.find({
      student: studentId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get all wallets
    const wallets = await Wallet.find({ student: studentId })
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
    const validMiningColleges = student.studentProfile.miningColleges.filter(mc => mc.college !== null);
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
// @access  Private (Student only)
export const getMiningStatusForCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const studentId = req.user.id;

    // Get active session for this college
    const session = await MiningSession.findOne({
      student: studentId,
      college: collegeId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get wallet for this college
    const wallet = await Wallet.findOne({
      student: studentId,
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
    });

    let stoppedCount = 0;
    for (const session of expiredSessions) {
      const miningDuration = (session.endTime - session.startTime) / (1000 * 60 * 60);
      const tokensEarned = miningDuration * session.earningRate;

      // Update session
      session.isActive = false;
      session.tokensEarned = tokensEarned;
      await session.save();

      // Update wallet
      await Wallet.findOneAndUpdate(
        { student: session.student, college: session.college },
        {
          $inc: {
            balance: tokensEarned,
            totalMined: tokensEarned
          },
          lastUpdated: now
        }
      );

      // Update college stats
      await College.findByIdAndUpdate(session.college, {
        $inc: {
          'stats.activeMiners': -1,
          'stats.totalTokensMined': tokensEarned
        }
      });

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

