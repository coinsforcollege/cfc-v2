import User from '../models/User.js';
import College from '../models/College.js';
import Wallet from '../models/Wallet.js';
import MiningSession from '../models/Mining.js';
import { createNotification, checkMinerMilestone, notifyStudentsAboutMinerMilestone, notifyAdminAboutMinerMilestone } from '../services/notification.service.js';
import { broadcastMiningUpdate } from '../websocket/miningSocket.js';

// @desc    Add college to user's mining list
// @route   POST /api/user/colleges/add
// @access  Private (User only)
export const addCollegeToMiningList = async (req, res, next) => {
  try {
    const { collegeId } = req.body;
    const userId = req.user.id;

    // Parse newCollege if it's a JSON string (from FormData)
    let newCollege = req.body.newCollege;
    if (typeof newCollege === 'string') {
      try {
        newCollege = JSON.parse(newCollege);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid newCollege data format'
        });
      }
    }

    const user = await User.findById(userId);

    // Check if user already has 10 colleges
    if (user.userProfile.miningColleges.length >= 10) {
      return res.status(400).json({
        success: false,
        message: 'You can only mine for up to 10 colleges'
      });
    }

    let college;

    // Handle college selection/creation
    if (collegeId) {
      college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }
    } else if (newCollege) {
      const { name, country, logo } = newCollege;

      if (!name || !country) {
        return res.status(400).json({
          success: false,
          message: 'College name and country are required'
        });
      }

      // Check if college already exists
      const existingCollege = await College.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        country: country
      });

      if (existingCollege) {
        college = existingCollege;
      } else {
        // Determine logo path
        let logoPath = null;
        if (req.file) {
          // File was uploaded
          logoPath = `/images/logo/${req.file.filename}`;
        } else if (logo) {
          // URL was provided
          logoPath = logo;
        }

        // Create new college
        college = await College.create({
          name,
          country,
          logo: logoPath,
          createdBy: userId,
          status: 'Unaffiliated'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide collegeId or newCollege data'
      });
    }

    // Check if college is already in user's mining list
    const alreadyAdded = user.userProfile.miningColleges.some(
      mc => mc.college.toString() === college._id.toString()
    );

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        message: 'This college is already in your mining list'
      });
    }

    // Add college to mining list
    user.userProfile.miningColleges.push({
      college: college._id,
      addedAt: new Date()
    });
    await user.save();

    // Populate the college data
    await user.populate('userProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate admin');

    // Get updated miner count for this college
    const currentMinerCount = await User.countDocuments({
      role: 'user',
      'userProfile.miningColleges.college': college._id
    });

    // Check if college has an admin to notify
    if (college.admin) {
      // Notify college admin about new miner
      await createNotification({
        recipient: college.admin,
        type: 'new_miner_joined',
        title: 'New miner joined your college!',
        message: `${user.name} just joined your college community and started mining for ${college.name}. Your community now has ${currentMinerCount} miners!`,
        data: {
          userId: user._id,
          studentName: user.name,
          collegeId: college._id,
          collegeName: college.name,
          totalMiners: currentMinerCount
        },
        category: 'college',
        priority: 'medium',
        actionUrl: '/college-admin/community'
      });

      // Check for miner milestone
      const milestone = checkMinerMilestone(currentMinerCount, currentMinerCount - 1);
      if (milestone) {
        // Notify admin about milestone
        await notifyAdminAboutMinerMilestone(college.admin, college.name, milestone);

        // Notify all students mining this college about milestone
        await notifyStudentsAboutMinerMilestone(college._id, college.name, milestone);
      }
    }

    // Broadcast mining update via WebSocket
    await broadcastMiningUpdate(userId);

    res.status(200).json({
      success: true,
      message: 'College added to mining list',
      data: {
        miningColleges: user.userProfile.miningColleges
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove college from user's mining list
// @route   DELETE /api/user/colleges/:collegeId
// @access  Private (User only)
export const removeCollegeFromMiningList = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const userId = req.user.id;

    // Check if there's an active mining session for this college
    const activeSession = await MiningSession.findOne({
      user: userId,
      college: collegeId,
      isActive: true
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'Please stop mining for this college before removing it from your list'
      });
    }

    // Remove college from mining list
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          'userProfile.miningColleges': { college: collegeId }
        }
      },
      { new: true }
    ).populate('userProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');

    res.status(200).json({
      success: true,
      message: 'College removed from mining list',
      data: {
        miningColleges: user.userProfile.miningColleges
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set primary college for user
// @route   POST /api/user/colleges/set-primary
// @access  Private (User only)
export const setPrimaryCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // Check if college is in user's mining list
    const collegeInList = user.userProfile.miningColleges.some(
      mc => mc.college.toString() === collegeId
    );

    if (!collegeInList) {
      return res.status(400).json({
        success: false,
        message: 'This college is not in your mining list'
      });
    }

    // Update primary college
    user.college = collegeId;
    await user.save();

    await user.populate('college', 'name country logo stats baseRate referralBonusRate');

    res.status(200).json({
      success: true,
      message: 'Primary college updated successfully',
      data: {
        college: user.college
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's wallet (all balances)
// @route   GET /api/user/wallet
// @access  Private (User only)
export const getWallet = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wallets = await Wallet.find({ user: userId })
      .populate('college', 'name country logo baseRate referralBonusRate')
      .sort({ balance: -1 });

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const totalMined = wallets.reduce((sum, wallet) => sum + wallet.totalMined, 0);

    res.status(200).json({
      success: true,
      data: {
        wallets,
        summary: {
          totalBalance,
          totalMined,
          collegeCount: wallets.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private (User only)
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user with populated data
    const user = await User.findById(userId)
      .populate('college', 'name country logo baseRate referralBonusRate')
      .populate('userProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate')
      .populate('userProfile.miningColleges.referredUsers.user', 'name email');

    // Get active mining sessions
    const activeSessions = await MiningSession.find({
      user: userId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get wallets
    const wallets = await Wallet.find({ user: userId })
      .populate('college', 'name country logo baseRate referralBonusRate')
      .sort({ balance: -1 });

    // Calculate totals
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const totalMined = wallets.reduce((sum, w) => sum + w.totalMined, 0);

    // Calculate current tokens for active sessions
    const now = new Date();
    const sessionsWithCurrentTokens = activeSessions.map(session => {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60);
      const currentTokens = miningDuration * session.earningRate;
      const remainingTime = session.endTime - now;
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

    // Get enhanced data for referred users (mining status and total tokens)
    const allReferredUserIds = new Set();
    validMiningColleges.forEach(mc => {
      mc.referredUsers?.forEach(ref => {
        if (ref.user && ref.user._id) {
          allReferredUserIds.add(ref.user._id.toString());
        }
      });
    });

    const referredUsersData = {};
    if (allReferredUserIds.size > 0) {
      const userIds = Array.from(allReferredUserIds);

      // Get active mining sessions for referred users
      const referredActiveSessions = await MiningSession.find({
        user: { $in: userIds },
        isActive: true
      });

      // Get wallets for referred users
      const referredWallets = await Wallet.find({
        user: { $in: userIds }
      });

      // Aggregate data per user
      userIds.forEach(userId => {
        const activeSessionsCount = referredActiveSessions.filter(
          s => s.user.toString() === userId
        ).length;

        const userWallets = referredWallets.filter(
          w => w.user.toString() === userId
        );

        const totalTokens = userWallets.reduce((sum, w) => sum + w.balance, 0);

        referredUsersData[userId] = {
          activeMiningCount: activeSessionsCount,
          totalTokens: totalTokens
        };
      });
    }

    // Enhance miningColleges with referred users data
    const enhancedMiningColleges = validMiningColleges.map(mc => {
      const enhancedReferredUsers = mc.referredUsers?.map(ref => {
        if (ref.user && ref.user._id) {
          const userId = ref.user._id.toString();
          return {
            ...ref.toObject(),
            activeMiningCount: referredUsersData[userId]?.activeMiningCount || 0,
            totalTokens: referredUsersData[userId]?.totalTokens || 0
          };
        }
        return ref;
      }) || [];

      return {
        ...mc.toObject(),
        referredUsers: enhancedReferredUsers
      };
    });

    // Calculate active friends for the dashboard card
    // Count unique referred users who have at least one active mining session
    const uniqueReferredUsers = new Set();
    const activeReferredUsers = new Set();

    validMiningColleges.forEach(mc => {
      mc.referredUsers?.forEach(ref => {
        if (ref.user && ref.user._id) {
          const userId = ref.user._id.toString();
          uniqueReferredUsers.add(userId);

          if (referredUsersData[userId]?.activeMiningCount > 0) {
            activeReferredUsers.add(userId);
          }
        }
      });
    });

    const activeFriendsCount = {
      active: activeReferredUsers.size,
      total: uniqueReferredUsers.size
    };

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          referralCode: user.userProfile.referralCode,
          totalReferrals: user.userProfile.totalReferrals,
          onboardingCompleted: user.userProfile.onboardingCompleted
        },
        miningColleges: enhancedMiningColleges,
        activeSessions: sessionsWithCurrentTokens,
        wallets: validWallets,
        summary: {
          totalBalance,
          totalMined,
          activeMiningSessions: activeSessions.length,
          activeFriendsCount
          // Note: Earning rates are now per-college, available in each session's earningRate field
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark onboarding as complete
// @route   POST /api/user/complete-onboarding
// @access  Private (User only)
export const completeOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user || user.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.userProfile.onboardingCompleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        onboardingCompleted: user.userProfile.onboardingCompleted
      }
    });
  } catch (error) {
    next(error);
  }
};
