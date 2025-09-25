import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModels.js';
import { College } from '../models/college.models.js';
import { Activity } from '../models/activity.model.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';
import sendSMS from '../utils/sendSMS.js';
import ApiResponse from '../utils/ApiResponse.js';

// Generate JWT token and send response
const sendTokenResponse = (user, statusCode, res, message = null) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output
  user.password = undefined;

  return res.status(statusCode)
    .cookie('token', token, options)
    .json(new ApiResponse(
      statusCode,
      {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          college: user.college,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isAdminVerified: user.isAdminVerified,
          totalTokensMined: user.totalTokensMined,
          miningStreak: user.miningStreak,
          referralCode: user.referralCode,
          canMineAt: user.canMineAt
        },
        message
      }));
};

// @desc    Register user (Deprecated - Use multi-step processes)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  const { role } = req.body;

  // Redirect users to appropriate multi-step registration process
  if (role === 'student') {
    throw new ApiError(400, 'Please use the multi-step student registration process. Start at POST /api/v1/auth/student/register/step1');
  } else if (role === 'college_admin') {
    throw new ApiError(400, 'Please use the multi-step admin registration process. Start at POST /api/v1/auth/admin/register/step1');
  } else {
    throw new ApiError(400, 'Invalid role. Please specify either "student" or "college_admin" and use the appropriate multi-step registration process.');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email })
    .select('+password')
    .populate('college', 'name logo slug');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Update login info
  user.lastLogin = new Date();
  user.loginCount += 1;
  user.ipAddress = req.ip;
  user.userAgent = req.get('User-Agent');
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('college', 'name logo slug stats adminStatus token')
      .populate('referredBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new ApiError(404, 'There is no user with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;

      await user.save({ validateBeforeSave: false });

      throw new ApiError(500, 'Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.body.resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
const updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key =>
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('college', 'name logo slug');

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      throw new ApiError(401, 'Password is incorrect');
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token
    });

    if (!user) {
      throw new ApiError(400, 'Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify phone
// @route   POST /api/auth/verify-phone
// @access  Private
const verifyPhone = async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = req.user;

    if (user.phoneVerificationToken !== code) {
      throw new ApiError(400, 'Invalid verification code');
    }

    user.isPhoneVerified = true;
    user.phoneVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification codes
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerification = async (req, res, next) => {
  try {
    const user = req.user;
    const { type } = req.body; // 'email' or 'phone'

    if (type === 'email' && !user.isEmailVerified) {
      await sendVerificationEmail(user);
    } else if (type === 'phone' && !user.isPhoneVerified) {
      await sendVerificationSMS(user);
    } else {
      throw new ApiError(400, 'Invalid verification type or already verified');
    }

    res.status(200).json({
      success: true,
      message: `${type} verification code sent successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new ApiError(400, 'Token is required');
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('college', 'name logo slug');

    if (!user) {
      return next(new ErrorResponse('Invalid token', 401));
    }

    sendTokenResponse(user, 200, res, 'Token refreshed successfully');
  } catch (error) {
    next(new ErrorResponse('Invalid token', 401));
  }
};

// Helper function to send verification email
const sendVerificationEmail = async (user) => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = verificationToken;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const message = `
    Welcome to College Token Platform!
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you did not create this account, please ignore this email.
  `;

  await sendEmail({
    email: user.email,
    subject: 'Verify Your Email Address - College Token Platform',
    message
  });
};

// Helper function to send verification SMS
const sendVerificationSMS = async (user) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.phoneVerificationToken = verificationCode;
  await user.save({ validateBeforeSave: false });

  const message = `Your College Token Platform verification code is: ${verificationCode}`;

  await sendSMS({
    phone: user.phone,
    message
  });
};


export { register, login, logout, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, verifyEmail, verifyPhone, resendVerification, refreshToken };