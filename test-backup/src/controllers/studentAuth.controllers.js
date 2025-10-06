import crypto from 'crypto';
import { User } from '../models/userModels.js';
import { College } from '../models/college.models.js';
import { Activity } from '../models/activity.model.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';
import sendSMS from '../utils/sendSMS.js';
import ApiResponse from '../utils/ApiResponse.js';
import { TempStudent } from '../models/tempStudent.model.js';
import bcrypt from 'bcryptjs';

// @desc    Student Registration Step 1 - Basic Information
// @route   POST /api/auth/student/register/step1
// @access  Public
const studentRegisterStep1 = async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
    termsAccepted
  } = req.body;

  // Check password confirmation
  if (password !== confirmPassword) {
    throw new ApiError(400, 'Password confirmation does not match password');
  }

  // Check terms acceptance
  if (!termsAccepted) {
    throw new ApiError(400, 'You must accept the terms and conditions');
  }

  // Check if email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email is already registered');
  }

  // Check if phone is already registered
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(400, 'Phone number is already registered');
  }

  // Generate temporary token for session management
  const tempToken = crypto.randomBytes(32).toString('hex');

  await TempStudent.create({
    tempToken,
    step: 1,
    firstName,
    lastName,
    email,
    phone,
    password,
  })

  res.status(200).json(new ApiResponse(
    200,
    { tempToken, step: 1 },
    'Step 1 completed. Continue registration.'
  ));
};

// @desc    Student Registration Step 2 - College Selection
// @route   POST /api/auth/student/register/step2
// @access  Public
const studentRegisterStep2 = async (req, res) => {
  const { tempToken, college, graduationYear } = req.body;

  // Validate temp token
  if (!tempToken) {
    throw new ApiError(400, 'Invalid session. Please start from step 1.');
  }

  const [tempStudent, collegeData] = await Promise.all([
    TempStudent.findOne({ tempToken }),
    College.findById(college)
  ]);

  if (!tempStudent) throw new ApiError(400, 'Invalid session. Please start from step 1.');
  if (!collegeData) throw new ApiError(400, 'Invalid college. Please select a valid college.');

  // Generate codes
  const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Update temp student
  tempStudent.graduationYear = graduationYear;
  tempStudent.college = collegeData._id;
  tempStudent.step = 2;
  tempStudent.emailCode = emailVerificationCode;
  tempStudent.phoneCode = phoneVerificationCode;
  tempStudent.emailCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  tempStudent.phoneCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  tempStudent.codesRequestedAt = new Date();
  await tempStudent.save();


  let emailSent = false;
  let messageSent = false;
  // Send email and phone verification codes (with partial failure support)
  try {
    const results = await Promise.allSettled([
      sendEmailVerificationCode(tempStudent),
      sendPhoneVerificationCode(tempStudent),
    ]);

    const emailSent = results[0].status === 'fulfilled';
    const messageSent = results[1].status === 'fulfilled';

    // If both failed → stop flow
    if (!emailSent && !messageSent) {
      throw new ApiError(
        500,
        'Failed to send verification codes. Please try again later.'
      );
    }

  } catch (error) {
    // In development, just log the error and continue
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    } else {
      throw new ApiError(500, 'Failed to send verification codes. Please try again.');
    }
  }

  res.status(200).json(new ApiResponse(
    200,
    { tempToken, step: 2, emailSent, messageSent },
    'Step 2 completed. Verification codes sent. Please verify to continue.'
  ));
};

// @desc    Student Registration Step 3 - Verification
// @route   POST /api/auth/student/register/step3
// @access  Public
// TODO: Wrap user creation, college update, and tempStudent deletion in a MongoDB transaction
const studentRegisterStep3 = async (req, res) => {
  const { tempToken, emailCode, phoneCode } = req.body;

  const tempStudent = await TempStudent.findOne({ tempToken });
  if (!tempStudent) {
    throw new ApiError(400, 'Invalid session. Please start from step 1.');
  }

  if (tempStudent.emailCodeExpiresAt < Date.now()) {
    throw new ApiError(400, 'Email verification code has expired');
  }
  if (tempStudent.phoneCodeExpiresAt < Date.now()) {
    throw new ApiError(400, 'Phone verification code has expired');
  }

  if (emailCode !== tempStudent.emailCode) {
    throw new ApiError(400, 'Invalid email verification code');
  }
  if (phoneCode !== tempStudent.phoneCode) {
    throw new ApiError(400, 'Invalid phone verification code');
  }

  // if codes are verified, create user account and delete temp student
  const userData = {
    firstName: tempStudent.firstName,
    lastName: tempStudent.lastName,
    email: tempStudent.email,
    phone: tempStudent.phone,
    password: tempStudent.password,
    role: 'student',
    isEmailVerified: true,
    isPhoneVerified: true,
    college: tempStudent.college,
    graduationYear: tempStudent.graduationYear,
  }

  const user = await User.create(userData);

  // if error deleting temp student, log it and continue
  // TODO: Uncomment this after improving the step 4
  // tempStudent.deleteOne().catch(err => {
  //   console.log('error deleting temp student', err);
  // });

  if (user && !user.referralCode) {
    user.generateReferralCode();
    await user.save({ validateBeforeSave: false });
  }

  // Update college stats
  const college = await College.findByIdAndUpdate(user.college, {
    $inc: { 'stats.totalStudents': 1 }
  }, { new: true });

  // Create activity
  await Activity.createActivity({
    type: 'user_registered',
    user: user._id,
    college: college._id,
    title: 'New student registered',
    data: {
      role: 'student',
      collegeName: college.name
    }
  });

  const step3Data = {
    tempToken,
    userId: user._id,
    isVerified: true,
    message: 'Account created and verified successfully!'
  };

  res.status(201).json(new ApiResponse(
    201,
    step3Data,
    'Step 3 completed. Proceed to referral step or complete registration.'
  ));
};

// @desc    Student Registration Step 4 - Referral (Optional)
// @route   POST /api/auth/student/register/step4
// @access  Public
const studentRegisterStep4 = async (req, res) => {
  const {
    tempToken,
    userId,
    referralCode,
    skipReferral
  } = req.body;

  const tempStudent = await TempStudent.findOne({ tempToken });
  if (!tempStudent) {
    throw new ApiError(400, 'Invalid session. Please start from step 1.');
  }

  // Get the user
  const user = await User.findById(userId).populate('college', 'name logo slug');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Handle referral if provided
  if (!skipReferral && referralCode) {
    const referrer = await User.findOne({
      referralCode: referralCode.toUpperCase()
    });

    if (referrer) {
      // Update user with referral
      user.referredBy = referrer._id;
      await user.save();

      // Update referrer's count
      await User.findByIdAndUpdate(referrer._id, {
        $inc: { referralCount: 1 }
      });

      // Create referral activity
      await Activity.createActivity({
        type: 'referral_success',
        user: referrer._id,
        relatedUser: user._id,
        college: user.college,
        title: 'Successful referral',
        data: {
          referredUserName: `${user.firstName} ${user.lastName}`,
          referrerName: `${referrer.firstName} ${referrer.lastName}`
        }
      });
    }
  }

  // Remove password from output
  user.password = undefined;

  const finalData = {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      college: user.college,
      graduationYear: user.graduationYear,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      totalTokensMined: user.totalTokensMined,
      miningStreak: user.miningStreak,
      referralCode: user.referralCode,
      canMineAt: user.canMineAt
    },
  };

  res.status(200)
    .json(new ApiResponse(200, finalData,
      skipReferral ? 'Registration completed successfully!'
        : referralCode
          ? 'Registration completed successfully with referral!'
          : 'Registration completed successfully!'
    ));
};

// Helper function to send email verification code
const sendEmailVerificationCode = async (user) => {
  const message = `
    Welcome to Coins for College!
    
    Your email verification code is: ${user.emailVerificationToken}
    
    Please enter this 6-digit code to verify your email address.
    
    This code will expire in 10 minutes.
    
    If you did not create this account, please ignore this email.
  `;

  await sendEmail({
    email: user.email,
    subject: 'Email Verification Code - College Token Platform',
    message
  });
};

// Helper function to send phone verification code
const sendPhoneVerificationCode = async (user) => {
  const message = `Your College Token Platform verification code is: ${user.phoneVerificationToken}`;

  await sendSMS({
    phone: user.phone,
    message
  });
};

// @desc    Resend verification codes with 60-second timer
// @route   POST /api/auth/student/resend-codes
// @access  Public
const resendVerificationCodes = async (req, res) => {
  const { tempToken } = req.body;

  // Validate temp token
  if (!tempToken) {
    throw new ApiError(400, 'Invalid session. Please start registration from step 1.');
  }

  const tempStudent = await TempStudent.findOne({ tempToken });
  if (!tempStudent) {
    throw new ApiError(400, 'Invalid session. Please start registration from step 1.');
  }

  // Generate new 6-digit codes
  const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  tempStudent.emailCode = emailVerificationCode;
  tempStudent.phoneCode = phoneVerificationCode;
  tempStudent.emailCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  tempStudent.phoneCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  tempStudent.codesRequestedAt = new Date();
  await tempStudent.save();

  const results = await Promise.allSettled([
    sendEmailVerificationCode(tempStudent),
    sendPhoneVerificationCode(tempStudent),
  ]);

  const response = {
    emailSent: results[0].status === 'fulfilled',
    messageSent: results[1].status === 'fulfilled',
  }

  res.status(200).json(new ApiResponse(
    200,
    {
      tempToken,
      response,
      message: 'New verification codes sent to your email and phone',
      waitTime: 60 // 60 seconds before next resend allowed
    },
    'Verification codes resent successfully'
  ));
};

export {
  studentRegisterStep1,
  studentRegisterStep2,
  studentRegisterStep3,
  studentRegisterStep4,
  resendVerificationCodes
};
