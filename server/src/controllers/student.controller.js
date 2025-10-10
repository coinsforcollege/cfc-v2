import User from '../models/User.js';
import College from '../models/College.js';
import Wallet from '../models/Wallet.js';
import MiningSession from '../models/Mining.js';

// @desc    Add college to student's mining list
// @route   POST /api/student/colleges/add
// @access  Private (Student only)
export const addCollegeToMiningList = async (req, res, next) => {
  try {
    const { collegeId } = req.body;
    const studentId = req.user.id;

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

    const student = await User.findById(studentId);

    // Check if student already has 10 colleges
    if (student.studentProfile.miningColleges.length >= 10) {
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
          createdBy: studentId,
          status: 'Unaffiliated'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide collegeId or newCollege data'
      });
    }

    // Check if college is already in student's mining list
    const alreadyAdded = student.studentProfile.miningColleges.some(
      mc => mc.college.toString() === college._id.toString()
    );

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        message: 'This college is already in your mining list'
      });
    }

    // Add college to mining list
    student.studentProfile.miningColleges.push({
      college: college._id,
      addedAt: new Date()
    });
    await student.save();

    // Populate the college data
    await student.populate('studentProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');

    res.status(200).json({
      success: true,
      message: 'College added to mining list',
      data: {
        miningColleges: student.studentProfile.miningColleges
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove college from student's mining list
// @route   DELETE /api/student/colleges/:collegeId
// @access  Private (Student only)
export const removeCollegeFromMiningList = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    const studentId = req.user.id;

    // Check if there's an active mining session for this college
    const activeSession = await MiningSession.findOne({
      student: studentId,
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
    const student = await User.findByIdAndUpdate(
      studentId,
      {
        $pull: {
          'studentProfile.miningColleges': { college: collegeId }
        }
      },
      { new: true }
    ).populate('studentProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');

    res.status(200).json({
      success: true,
      message: 'College removed from mining list',
      data: {
        miningColleges: student.studentProfile.miningColleges
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set primary college for student
// @route   POST /api/student/colleges/set-primary
// @access  Private (Student only)
export const setPrimaryCollege = async (req, res, next) => {
  try {
    const { collegeId } = req.body;
    const studentId = req.user.id;

    const student = await User.findById(studentId);

    // Check if college is in student's mining list
    const collegeInList = student.studentProfile.miningColleges.some(
      mc => mc.college.toString() === collegeId
    );

    if (!collegeInList) {
      return res.status(400).json({
        success: false,
        message: 'This college is not in your mining list'
      });
    }

    // Update primary college
    student.college = collegeId;
    await student.save();

    await student.populate('college', 'name country logo stats baseRate referralBonusRate');

    res.status(200).json({
      success: true,
      message: 'Primary college updated successfully',
      data: {
        college: student.college
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's wallet (all balances)
// @route   GET /api/student/wallet
// @access  Private (Student only)
export const getWallet = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const wallets = await Wallet.find({ student: studentId })
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

// @desc    Get student dashboard data
// @route   GET /api/student/dashboard
// @access  Private (Student only)
export const getDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    // Get student with populated data
    const student = await User.findById(studentId)
      .populate('college', 'name country logo baseRate referralBonusRate')
      .populate('studentProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');

    // Get active mining sessions
    const activeSessions = await MiningSession.find({
      student: studentId,
      isActive: true
    }).populate('college', 'name country logo baseRate referralBonusRate');

    // Get wallets
    const wallets = await Wallet.find({ student: studentId })
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
    const validMiningColleges = student.studentProfile.miningColleges.filter(mc => mc.college !== null);
    const validWallets = wallets.filter(w => w.college !== null);

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          college: student.college,
          referralCode: student.studentProfile.referralCode,
          totalReferrals: student.studentProfile.totalReferrals
        },
        miningColleges: validMiningColleges,
        activeSessions: sessionsWithCurrentTokens,
        wallets: validWallets,
        summary: {
          totalBalance,
          totalMined,
          activeMiningSessions: activeSessions.length
          // Note: Earning rates are now per-college, available in each session's earningRate field
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
