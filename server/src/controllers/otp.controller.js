import User from '../models/User.js';
import College from '../models/College.js';
import OTPVerification from '../models/OTPVerification.js';
import { sendOTPEmail } from '../utils/emailService.js';
import jwt from 'jsonwebtoken';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate verification token (valid for 30 minutes after OTP verification)
const generateVerificationToken = (email, role) => {
  return jwt.sign(
    { email, role, type: 'otp_verified' },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
};

// @desc    Send OTP for user registration
// @route   POST /api/auth/otp/send/user
// @access  Public
export const sendOTPForUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, referralCode, collegeId, language } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }

    // Validate college if collegeId provided
    if (collegeId) {
      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }
    }

    // Validate referral code if provided
    if (referralCode) {
      const referredByUser = await User.findOne({
        'userProfile.referralCode': referralCode,
        role: 'user'
      });

      if (!referredByUser) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
    }

    // Delete any existing OTP for this email and role
    await OTPVerification.deleteMany({ email: email.toLowerCase(), role: 'user' });

    // Generate OTP
    const otp = generateOTP();
    console.log('OTP for user registration:', email.toLowerCase(), otp);

    // Save OTP to database (expires in 10 minutes)
    const otpDoc = await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      role: 'user',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, name, otp, language || 'en');

    if (!emailResult.success) {
      // Clean up if email fails
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: email.toLowerCase(),
        expiresIn: 600 // 10 minutes in seconds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP for college admin registration
// @route   POST /api/auth/otp/send/college
// @access  Public
export const sendOTPForCollege = async (req, res, next) => {
  try {
    const { name, email, phone, password, collegeId, newCollege, language } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }

    // Validate college selection/creation
    if (collegeId) {
      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }

      if (college.admin) {
        return res.status(400).json({
          success: false,
          message: 'This college already has an admin. Only one admin per college is allowed.'
        });
      }
    } else if (newCollege) {
      const collegeData = typeof newCollege === 'string' ? JSON.parse(newCollege) : newCollege;
      const { name: collegeName, country } = collegeData;

      if (!collegeName || !country) {
        return res.status(400).json({
          success: false,
          message: 'College name and country are required'
        });
      }

      // Check if college already exists
      const existingCollege = await College.findOne({
        name: { $regex: new RegExp(`^${collegeName}$`, 'i') },
        country: country
      });

      if (existingCollege && existingCollege.admin) {
        return res.status(400).json({
          success: false,
          message: 'This college already has an admin. Only one admin per college is allowed.'
        });
      }
    }

    // Delete any existing OTP for this email and role
    await OTPVerification.deleteMany({ email: email.toLowerCase(), role: 'college_admin' });

    // Generate OTP
    const otp = generateOTP();
    console.log('OTP for college registration:', email.toLowerCase(), otp);

    // Save OTP to database (expires in 10 minutes)
    const otpDoc = await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      role: 'college_admin',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, name, otp, language || 'en');

    if (!emailResult.success) {
      // Clean up if email fails
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: email.toLowerCase(),
        expiresIn: 600 // 10 minutes in seconds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP for student registration
// @route   POST /api/auth/otp/send/student
// @access  Public
export const sendOTPForStudent = async (req, res, next) => {
  try {
    const { name, email, phone, password, language } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }

    // Delete any existing OTP for this email and role
    await OTPVerification.deleteMany({ email: email.toLowerCase(), role: 'student' });

    // Generate OTP
    const otp = generateOTP();
    console.log('OTP for student registration:', email.toLowerCase(), otp);

    // Save OTP to database (expires in 10 minutes)
    const otpDoc = await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      role: 'student',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, name, otp, language || 'en');

    if (!emailResult.success) {
      // Clean up if email fails
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: email.toLowerCase(),
        expiresIn: 600 // 10 minutes in seconds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/otp/verify
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, role } = req.body;

    // Validation
    if (!email || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and role'
      });
    }

    if (!['user', 'college_admin', 'student'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Find OTP document
    const otpDoc = await OTPVerification.findOne({
      email: email.toLowerCase(),
      role,
      isVerified: false
    }).sort({ createdAt: -1 }); // Get the most recent one

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or already verified. Please request a new OTP.'
      });
    }

    // Check if expired
    if (otpDoc.isExpired()) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts (max 5 attempts)
    if (otpDoc.attempts >= 5) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      await otpDoc.incrementAttempts();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        attemptsRemaining: 5 - (otpDoc.attempts + 1)
      });
    }

    // Mark as verified
    otpDoc.isVerified = true;
    await otpDoc.save();

    // Generate verification token
    const verificationToken = generateVerificationToken(email.toLowerCase(), role);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        verificationToken,
        email: email.toLowerCase(),
        role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/otp/resend
// @access  Public
export const resendOTP = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    // Validation
    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and role'
      });
    }

    if (!['user', 'college_admin', 'student'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Find the most recent OTP document
    const otpDoc = await OTPVerification.findOne({
      email: email.toLowerCase(),
      role
    }).sort({ createdAt: -1 });

    // Check if enough time has passed (30 seconds)
    if (otpDoc && otpDoc.createdAt) {
      const timeSinceLastOTP = Date.now() - otpDoc.createdAt.getTime();
      if (timeSinceLastOTP < 30000) { // 30 seconds
        const remainingTime = Math.ceil((30000 - timeSinceLastOTP) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          waitTime: remainingTime
        });
      }
    }

    // Check if user exists (shouldn't exist for registration OTP)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Get user name from previous request (we'll need to modify this)
    // For now, use a generic name
    const userName = 'User';

    // Delete any existing OTP for this email and role
    await OTPVerification.deleteMany({ email: email.toLowerCase(), role });

    // Generate new OTP
    const otp = generateOTP();
    console.log('OTP for resend:', email.toLowerCase(), otp);

    // Save OTP to database
    const newOtpDoc = await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      role,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, userName, otp);

    if (!emailResult.success) {
      // Clean up if email fails
      await OTPVerification.findByIdAndDelete(newOtpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully to your email',
      data: {
        email: email.toLowerCase(),
        expiresIn: 600, // 10 minutes in seconds
        canResendAfter: 30 // seconds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP for password change
// @route   POST /api/auth/otp/send/password-change
// @access  Private
export const sendOTPForPasswordChange = async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password'
      });
    }

    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Delete any existing OTP for this email and password_change role
    await OTPVerification.deleteMany({ email: user.email.toLowerCase(), role: 'password_change' });

    // Generate OTP
    const otp = generateOTP();
    console.log('OTP for password change:', user.email.toLowerCase(), otp);

    // Save OTP to database (expires in 10 minutes)
    const otpDoc = await OTPVerification.create({
      email: user.email.toLowerCase(),
      otp,
      role: 'password_change',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(user.email, user.name, otp);

    if (!emailResult.success) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: user.email.toLowerCase(),
        expiresIn: 600
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for password change
// @route   POST /api/auth/otp/verify/password-change
// @access  Private
export const verifyOTPForPasswordChange = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    // Validation
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide OTP'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find OTP document
    const otpDoc = await OTPVerification.findOne({
      email: user.email.toLowerCase(),
      role: 'password_change',
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or already verified. Please request a new OTP.'
      });
    }

    // Check if expired
    if (otpDoc.isExpired()) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (otpDoc.attempts >= 5) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      await otpDoc.incrementAttempts();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        attemptsRemaining: 5 - (otpDoc.attempts + 1)
      });
    }

    // Mark as verified
    otpDoc.isVerified = true;
    await otpDoc.save();

    // Generate verification token
    const verificationToken = generateVerificationToken(user.email.toLowerCase(), 'password_change');

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        verificationToken,
        email: user.email.toLowerCase()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP for password change
// @route   POST /api/auth/otp/resend/password-change
// @access  Private
export const resendOTPForPasswordChange = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the most recent OTP document
    const otpDoc = await OTPVerification.findOne({
      email: user.email.toLowerCase(),
      role: 'password_change'
    }).sort({ createdAt: -1 });

    // Check if enough time has passed (30 seconds)
    if (otpDoc && otpDoc.createdAt) {
      const timeSinceLastOTP = Date.now() - otpDoc.createdAt.getTime();
      if (timeSinceLastOTP < 30000) {
        const remainingTime = Math.ceil((30000 - timeSinceLastOTP) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
          waitTime: remainingTime
        });
      }
    }

    // Delete any existing OTP for this email and password_change role
    await OTPVerification.deleteMany({ email: user.email.toLowerCase(), role: 'password_change' });

    // Generate new OTP
    const otp = generateOTP();
    console.log('OTP for password change resend:', user.email.toLowerCase(), otp);

    // Save OTP to database
    const newOtpDoc = await OTPVerification.create({
      email: user.email.toLowerCase(),
      otp,
      role: 'password_change',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(user.email, user.name, otp);

    if (!emailResult.success) {
      await OTPVerification.findByIdAndDelete(newOtpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully to your email',
      data: {
        email: user.email.toLowerCase(),
        expiresIn: 600,
        canResendAfter: 30
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP for forgot password
// @route   POST /api/auth/otp/send/forgot-password
// @access  Public
export const sendOTPForForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist.'
      });
    }

    // Delete any existing OTP for this email and forgot_password role
    await OTPVerification.deleteMany({ email: email.toLowerCase(), role: 'forgot_password' });

    // Generate OTP
    const otp = generateOTP();
    console.log('OTP for forgot password:', email.toLowerCase(), otp);

    // Save OTP to database
    const otpDoc = await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      role: 'forgot_password',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, user.name, otp);

    if (!emailResult.success) {
      // Clean up if email fails
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: email.toLowerCase(),
        expiresIn: 600 // 10 minutes in seconds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for forgot password
// @route   POST /api/auth/otp/verify/forgot-password
// @access  Public
export const verifyOTPForForgotPassword = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find OTP document
    const otpDoc = await OTPVerification.findOne({
      email: email.toLowerCase(),
      role: 'forgot_password',
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or already verified. Please request a new OTP.'
      });
    }

    // Check if expired
    if (otpDoc.isExpired()) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check attempts
    if (otpDoc.attempts >= 5) {
      await OTPVerification.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      await otpDoc.incrementAttempts();
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        attemptsRemaining: 5 - (otpDoc.attempts + 1)
      });
    }

    // Mark as verified
    otpDoc.isVerified = true;
    await otpDoc.save();

    // Generate verification token
    const verificationToken = generateVerificationToken(email.toLowerCase(), 'forgot_password');

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        verificationToken,
        email: email.toLowerCase()
      }
    });
  } catch (error) {
    next(error);
  }
};
