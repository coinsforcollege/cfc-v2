import { User } from '../models/userModels.js';
import { College } from '../models/college.models.js';
import { Activity } from '../models/activity.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get pending admin verifications
// @route   GET /api/admin/pending-verifications
// @access  Private (Platform Admin only)
const getPendingVerifications = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get college admins pending verification
  const pendingAdmins = await User.find({
    role: 'college_admin',
    isAdminVerified: false,
    adminVerificationSubmittedAt: { $exists: true }
  })
    .populate('college', 'name address type website')
    .select('firstName lastName workEmail position department adminVerificationSubmittedAt createdAt')
    .sort({ adminVerificationSubmittedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments({
    role: 'college_admin',
    isAdminVerified: false,
    adminVerificationSubmittedAt: { $exists: true }
  });

  res.status(200).json(new ApiResponse(
    200,
    {
      admins: pendingAdmins,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    },
    'Pending verifications fetched successfully'
  ));
};

// @desc    Verify college admin
// @route   POST /api/admin/verify-admin/:userId
// @access  Private (Platform Admin only)
const verifyAdmin = async (req, res) => {
  const { userId } = req.params;
  const { approved, reason } = req.body;
  const platformAdmin = req.user;

  const user = await User.findById(userId).populate('college');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== 'college_admin') {
    throw new ApiError(400, 'User is not a college admin');
  }

  if (user.isAdminVerified) {
    throw new ApiError(400, 'Admin is already verified');
  }

  if (approved) {
    // Approve admin
    user.isAdminVerified = true;
    user.adminVerificationDate = new Date();
    await user.save();

    // Update college
    if (user.college) {
      user.college.hasVerifiedAdmin = true;
      user.college.verificationDate = new Date();
      user.college.verifiedBy = platformAdmin._id;
      await user.college.save();
    }

    // Create activity
    await Activity.createActivity({
      type: 'admin_verified',
      user: user._id,
      college: user.college?._id,
      title: 'Admin verified',
      data: {
        adminName: `${user.firstName} ${user.lastName}`,
        collegeName: user.college?.name,
        verifiedBy: `${platformAdmin.firstName} ${platformAdmin.lastName}`
      }
    });

    // Send approval email
    await sendAdminVerificationEmail(user, true, reason);

    res.status(200).json(new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.workEmail,
          isVerified: user.isAdminVerified
        },
        college: user.college ? {
          id: user.college._id,
          name: user.college.name,
          hasVerifiedAdmin: user.college.hasVerifiedAdmin
        } : null
      },
      'Admin verified successfully'
    ));
  } else {
    // Reject admin
    user.isSuspended = true;
    user.suspensionReason = reason || 'Admin verification rejected';
    await user.save();

    // Send rejection email
    await sendAdminVerificationEmail(user, false, reason);

    res.status(200).json(new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.workEmail,
          isSuspended: user.isSuspended
        }
      },
      'Admin verification rejected'
    ));
  }
};

// @desc    Get admin verification details
// @route   GET /api/admin/verification/:userId
// @access  Private (Platform Admin only)
const getAdminVerificationDetails = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .populate('college', 'name address type website email establishedYear enrollment')
    .select('firstName lastName email workEmail workPhone position department isAdminVerified adminVerificationDate adminVerificationSubmittedAt createdAt lastLogin');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== 'college_admin') {
    throw new ApiError(400, 'User is not a college admin');
  }

  // Get user's activity
  const recentActivity = await Activity.find({
    user: user._id
  })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json(new ApiResponse(
    200,
    {
      user,
      recentActivity
    },
    'Admin verification details fetched successfully'
  ));
};

// @desc    Get verification statistics
// @route   GET /api/admin/verification-stats
// @access  Private (Platform Admin only)
const getVerificationStats = async (req, res) => {
  const stats = await Promise.all([
    // Total pending verifications
    User.countDocuments({
      role: 'college_admin',
      isAdminVerified: false,
      adminVerificationSubmittedAt: { $exists: true }
    }),
    
    // Total verified admins
    User.countDocuments({
      role: 'college_admin',
      isAdminVerified: true
    }),
    
    // Total rejected admins
    User.countDocuments({
      role: 'college_admin',
      isSuspended: true
    }),
    
    // Verifications this week
    User.countDocuments({
      role: 'college_admin',
      isAdminVerified: true,
      adminVerificationDate: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }),
    
    // Colleges with verified admins
    College.countDocuments({
      hasVerifiedAdmin: true
    })
  ]);

  const [pending, verified, rejected, thisWeek, collegesWithAdmins] = stats;

  res.status(200).json(new ApiResponse(
    200,
    {
      pending,
      verified,
      rejected,
      thisWeek,
      collegesWithAdmins,
      total: pending + verified + rejected
    },
    'Verification statistics fetched successfully'
  ));
};

// Helper function to send admin verification email
const sendAdminVerificationEmail = async (user, approved, reason) => {
  const subject = approved 
    ? 'College Admin Account Verified - College Token Platform'
    : 'College Admin Account Application Update - College Token Platform';

  const message = approved 
    ? `
      Congratulations ${user.firstName}!
      
      Your College Administrator account for ${user.college?.name || 'your college'} has been verified and approved.
      
      You can now access all admin features including:
      - Student management and analytics
      - Token configuration and management
      - College profile customization
      - Engagement tools
      
      Login to your dashboard: ${process.env.CLIENT_URL}/admin/dashboard
      
      Welcome to the College Token Platform!
    `
    : `
      Hello ${user.firstName},
      
      Thank you for your interest in the College Token Platform.
      
      After review, we are unable to verify your College Administrator account at this time.
      
      ${reason ? `Reason: ${reason}` : ''}
      
      If you believe this is an error or have additional information to provide, please contact our support team.
      
      Thank you for your understanding.
    `;

  await sendEmail({
    email: user.workEmail,
    subject,
    message
  });
};

export {
  getPendingVerifications,
  verifyAdmin,
  getAdminVerificationDetails,
  getVerificationStats
};
