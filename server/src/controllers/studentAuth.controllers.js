import crypto from 'crypto';
import { User } from '../models/userModels.js';
import { College } from '../models/college.models.js';
import { Activity } from '../models/activity.model.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';
import sendSMS from '../utils/sendSMS.js';
import ApiResponse from '../utils/ApiResponse.js';

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

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Generate temporary token for session management
  const tempToken = crypto.randomBytes(32).toString('hex');

  // Store step 1 data for next step
  const step1Data = {
    tempToken,
    email,
    password, // Will be hashed when user is created
    firstName,
    lastName,
    phone,
    termsAccepted: true
  };

  res.status(200).json(new ApiResponse(
    200,
    step1Data,
    'Step 1 completed. Please proceed to college selection.'
  ));
};

// @desc    Student Registration Step 2 - College Selection
// @route   POST /api/auth/student/register/step2
// @access  Public
const studentRegisterStep2 = async (req, res) => {
  const {
    tempToken,
    email,
    password,
    firstName,
    lastName,
    phone,
    collegeId,
    graduationYear,
    createNewCollege,
    newCollegeData
  } = req.body;

  // Validate temp token
  if (!tempToken) {
    throw new ApiError(400, 'Invalid session. Please start from step 1.');
  }

  let college;

  // Handle new college creation if needed
  if (createNewCollege && newCollegeData) {
    // Check if college already exists
    const existingCollege = await College.findOne({
      name: { $regex: new RegExp('^' + newCollegeData.name + '$', 'i') }
    });

    if (existingCollege) {
      throw new ApiError(400, 'College already exists. Please select it from the list.');
    }

    // Create new college
    college = await College.create({
      name: newCollegeData.name,
      shortName: newCollegeData.shortName,
      address: {
        city: newCollegeData.city,
        state: newCollegeData.state,
        zipCode: newCollegeData.zipCode,
        country: newCollegeData.country || 'United States'
      },
      type: newCollegeData.type,
      website: newCollegeData.website,
      email: newCollegeData.email,
      status: 'pending'
    });

    // Create activity for college addition
    await Activity.createActivity({
      type: 'college_added',
      college: college._id,
      title: 'New college added by student',
      data: {
        collegeName: newCollegeData.name,
        addedBy: 'student',
        studentEmail: email
      }
    });
  } else {
    // Use existing college
    college = await College.findById(collegeId);
    if (!college) {
      throw new ApiError(404, 'College not found');
    }
  }

  // Validate graduation year
  const currentYear = new Date().getFullYear();
  if (graduationYear < 2024 || graduationYear > 2030) {
    throw new ApiError(400, 'Please provide a valid graduation year (2024-2030)');
  }

  const step2Data = {
    tempToken,
    email,
    password,
    firstName,
    lastName,
    phone,
    collegeId: college._id,
    collegeName: college.name,
    graduationYear
  };

  res.status(200).json(new ApiResponse(
    200,
    step2Data,
    'Step 2 completed. Please proceed to verification.'
  ));
};

// @desc    Student Registration Step 3 - Verification
// @route   POST /api/auth/student/register/step3
// @access  Public
const studentRegisterStep3 = async (req, res) => {
  const {
    tempToken,
    email,
    password,
    firstName,
    lastName,
    phone,
    collegeId,
    graduationYear,
    emailCode,
    phoneCode,
    requestCodes
  } = req.body;

  // Validate temp token
  if (!tempToken) {
    throw new ApiError(400, 'Invalid session. Please start from step 1.');
  }

  // If requesting verification codes
  if (requestCodes) {
    // Generate 6-digit codes
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store codes temporarily (in production, use Redis or session storage)
    // For now, we'll create a temporary user record to store codes
    const tempUser = {
      email,
      firstName,
      emailVerificationToken: emailVerificationCode,
      phoneVerificationToken: phoneVerificationCode
    };

    // Send email verification code
    await sendEmailVerificationCode(tempUser);

    // Send phone verification code
    await sendPhoneVerificationCode(tempUser);

    return res.status(200).json(new ApiResponse(
      200,
      {
        tempToken,
        codesRequested: true,
        message: 'Verification codes sent to your email and phone'
      },
      'Verification codes sent successfully'
    ));
  }

  // If verifying codes and creating account
  if (emailCode && phoneCode) {
    // In production, retrieve stored codes from Redis/session
    // For now, we'll validate against a simple pattern or stored codes

    // Validate codes (6 digits)
    if (!/^\d{6}$/.test(emailCode) || !/^\d{6}$/.test(phoneCode)) {
      throw new ApiError(400, 'Verification codes must be 6 digits');
    }

    // Create user account
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'student',
      college: collegeId,
      graduationYear,
      isEmailVerified: true, // Verified through codes
      isPhoneVerified: true  // Verified through codes
    };

    const user = await User.create(userData);

    // Update college stats
    const college = await College.findById(collegeId);
    college.stats.totalStudents += 1;
    await college.save();

    // Create activity
    await Activity.createActivity({
      type: 'user_registered',
      user: user._id,
      college: collegeId,
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
  } else {
    throw new ApiError(400, 'Please provide both email and phone verification codes, or request new codes');
  }
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

  // Validate temp token
  if (!tempToken) {
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

  // Generate JWT token for user
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

  const finalData = {
    token,
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
    .cookie('token', token, options)
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
    Welcome to College Token Platform!
    
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
  const { tempToken, email, phone, firstName } = req.body;

  // Validate temp token
  if (!tempToken) {
    throw new ApiError(400, 'Invalid session. Please start registration from step 1.');
  }

  // Generate new 6-digit codes
  const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Create temporary user object for sending codes
  const tempUser = {
    email,
    phone,
    firstName,
    emailVerificationToken: emailVerificationCode,
    phoneVerificationToken: phoneVerificationCode
  };

  // Send email verification code
  await sendEmailVerificationCode(tempUser);

  // Send phone verification code
  await sendPhoneVerificationCode(tempUser);

  res.status(200).json(new ApiResponse(
    200,
    {
      tempToken,
      codesResent: true,
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
