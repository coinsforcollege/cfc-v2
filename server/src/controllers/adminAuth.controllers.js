import crypto from 'crypto';
import { User } from '../models/userModels.js';
import { College } from '../models/college.models.js';
import { Activity } from '../models/activity.model.js';
import ApiError from '../utils/ApiError.js';
import sendEmail from '../utils/sendEmail.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Admin Registration Step 1 - College Verification
// @route   POST /api/auth/admin/register/step1
// @access  Public
const adminRegisterStep1 = async (req, res) => {
  const { collegeId, workEmail, position, createNewCollege, newCollegeData } = req.body;
  
  let college;
  
  // Handle new college creation if needed
  if (createNewCollege && newCollegeData) {
    // Check if college already exists
    const existingCollege = await College.findOne({
      name: { $regex: new RegExp('^' + newCollegeData.name + '$', 'i') }
    });

    if (existingCollege) {
      throw new ApiError(400, 'College already exists');
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
  } else {
    // Use existing college
    college = await College.findById(collegeId);
    if (!college) {
      throw new ApiError(404, 'College not found');
    }
  }

  // Check if college already has an admin
  if (college.admin) {
    throw new ApiError(400, 'This college already has an admin');
  }

  // Check if work email is already registered
  const existingUser = await User.findOne({ 
    $or: [
      { email: workEmail },
      { workEmail: workEmail }
    ]
  });
  
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Store step 1 data in session/temporary storage
  // In a real app, you might use Redis or database temporary storage
  const tempToken = crypto.randomBytes(32).toString('hex');
  
  // For now, we'll return the data to be sent back in step 2
  const step1Data = {
    tempToken,
    collegeId: college._id,
    workEmail,
    position,
    collegeName: college.name
  };

  res.status(200).json(new ApiResponse(
    200,
    step1Data,
    'Step 1 completed. Please proceed to personal information.'
  ));
};

// @desc    Admin Registration Step 2 - Personal Information
// @route   POST /api/auth/admin/register/step2
// @access  Public
const adminRegisterStep2 = async (req, res) => {
  const { 
    tempToken,
    collegeId,
    workEmail,
    position,
    firstName,
    lastName,
    workPhone,
    password,
    department
  } = req.body;

  // Validate temp token (in production, verify against stored session)
  if (!tempToken) {
    throw new ApiError(400, 'Invalid session. Please start from step 1.');
  }

  // Verify college still exists and available
  const college = await College.findById(collegeId);
  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  if (college.admin) {
    throw new ApiError(400, 'This college already has an admin');
  }

  // Create user account
  const userData = {
    firstName,
    lastName,
    email: workEmail, // Use work email as primary email
    workEmail,
    workPhone,
    phone: workPhone, // Use work phone as primary phone for now
    password,
    role: 'college_admin',
    position,
    department,
    college: collegeId,
    adminVerificationSubmittedAt: new Date()
  };

  const user = await User.create(userData);

  // Set college admin
  college.admin = user._id;
  college.adminJoinedDate = new Date();
  await college.save();

  // Create activity
  await Activity.createActivity({
    type: 'college_joined',
    user: user._id,
    college: college._id,
    title: 'College admin registered',
    data: {
      collegeName: college.name,
      adminName: `${firstName} ${lastName}`
    }
  });

  // Send verification email
  await sendVerificationEmail(user);

  const step2Data = {
    tempToken,
    userId: user._id,
    collegeId: college._id,
    isEmailVerified: user.isEmailVerified,
    message: 'Account created successfully. Please check your email for verification.'
  };

  res.status(201).json(new ApiResponse(
    201,
    step2Data,
    'Step 2 completed. Please verify your email to proceed.'
  ));
};

// @desc    Admin Registration Step 3 - College Profile Setup
// @route   POST /api/auth/admin/register/step3
// @access  Private (requires email verification)
const adminRegisterStep3 = async (req, res) => {
  const { 
    tempToken,
    collegeId,
    logo,
    description,
    establishedYear,
    enrollment,
    socialMedia,
    colors
  } = req.body;

  // Get user and college
  const user = req.user;
  const college = await College.findById(collegeId);

  if (!college || college.admin.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this college');
  }

  // Update college profile
  const updateData = {};
  if (logo) updateData.logo = logo;
  if (description) updateData.description = description;
  if (establishedYear) updateData.establishedYear = establishedYear;
  if (enrollment) updateData.enrollment = enrollment;
  if (socialMedia) updateData.socialMedia = socialMedia;
  if (colors) updateData.colors = colors;

  await College.findByIdAndUpdate(collegeId, updateData, {
    new: true,
    runValidators: true
  });

  const step3Data = {
    tempToken,
    collegeId,
    message: 'College profile updated successfully. You can now configure your token or skip to complete registration.'
  };

  res.status(200).json(new ApiResponse(
    200,
    step3Data,
    'Step 3 completed. Proceed to token configuration or complete registration.'
  ));
};

// @desc    Admin Registration Step 4 - Token Configuration (Optional)
// @route   POST /api/auth/admin/register/step4
// @access  Private
const adminRegisterStep4 = async (req, res) => {
  const {
    tempToken,
    collegeId,
    tokenName,
    tokenSymbol,
    tokenDescription,
    maxSupply,
    earnMethods,
    spendMethods,
    customEarnMethods,
    customSpendMethods,
    launchTimeline,
    tokenIcon,
    colorScheme,
    skipTokenConfig
  } = req.body;

  const user = req.user;
  const college = await College.findById(collegeId);

  if (!college || college.admin.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this college');
  }

  if (!skipTokenConfig) {
    // Configure token
    const tokenConfig = {
      name: tokenName,
      symbol: tokenSymbol?.toUpperCase(),
      description: tokenDescription,
      maxSupply,
      earnMethods: earnMethods || [],
      spendMethods: spendMethods || [],
      customEarnMethods: customEarnMethods || [],
      customSpendMethods: customSpendMethods || [],
      launchTimeline,
      icon: tokenIcon,
      colorScheme,
      isConfigured: true,
      configuredDate: new Date()
    };

    college.token = tokenConfig;
    await college.save();

    // Create activity for token configuration
    await Activity.createActivity({
      type: 'token_configured',
      user: user._id,
      college: college._id,
      title: 'Token configured',
      data: {
        tokenName,
        tokenSymbol: tokenSymbol?.toUpperCase(),
        collegeName: college.name
      }
    });
  }

  // Mark college as active
  college.status = 'active';
  await college.save();

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
      workEmail: user.workEmail,
      role: user.role,
      college: college._id,
      isEmailVerified: user.isEmailVerified,
      isAdminVerified: user.isAdminVerified,
      position: user.position
    },
    college: {
      id: college._id,
      name: college.name,
      status: college.status,
      hasToken: college.token.isConfigured
    },
    message: skipTokenConfig 
      ? 'Registration completed successfully!' 
      : 'Registration completed successfully with token configuration!'
  };

  res.status(200)
    .cookie('token', token, options)
    .json(new ApiResponse(200, finalData));
};

// @desc    Complete Registration (Skip Token Config)
// @route   POST /api/auth/admin/register/complete
// @access  Private
const completeAdminRegistration = async (req, res) => {
  const { tempToken, collegeId } = req.body;
  
  const user = req.user;
  const college = await College.findById(collegeId);

  if (!college || college.admin.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this college');
  }

  // Mark college as active
  college.status = 'active';
  await college.save();

  // Generate JWT token
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

  user.password = undefined;

  const responseData = {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      workEmail: user.workEmail,
      role: user.role,
      college: college._id,
      isEmailVerified: user.isEmailVerified,
      isAdminVerified: user.isAdminVerified,
      position: user.position
    },
    college: {
      id: college._id,
      name: college.name,
      status: college.status,
      hasToken: college.token.isConfigured
    }
  };

  res.status(200)
    .cookie('token', token, options)
    .json(new ApiResponse(
      200, 
      responseData, 
      'Registration completed successfully!'
    ));
};

// Helper function to send verification email
const sendVerificationEmail = async (user) => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = verificationToken;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const message = `
    Welcome to College Token Platform!
    
    Thank you for joining as a College Administrator. Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    After email verification, you can complete your college profile setup and configure your college token.
    
    If you did not create this account, please ignore this email.
  `;

  await sendEmail({
    email: user.workEmail,
    subject: 'Verify Your Email Address - College Token Platform Admin',
    message
  });
};

export {
  adminRegisterStep1,
  adminRegisterStep2,
  adminRegisterStep3,
  adminRegisterStep4,
  completeAdminRegistration
};
