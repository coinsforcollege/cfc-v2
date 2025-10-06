import User from '../models/User.js';
import College from '../models/College.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Register a new student
// @route   POST /api/auth/register/student
// @access  Public
export const registerStudent = async (req, res, next) => {
  try {
    const { name, email, phone, password, collegeId, newCollege, referralCode } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password'
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

    let college;

    // Handle college selection/creation
    if (collegeId) {
      // Student selected existing college
      college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }
    } else if (newCollege) {
      // Student is creating a new college
      const { name: collegeName, country, logo } = newCollege;
      
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

      if (existingCollege) {
        college = existingCollege;
      } else {
        // Create new college (student created, no admin yet)
        college = await College.create({
          name: collegeName,
          country,
          logo: logo || null,
          createdBy: null // Will be set after user is created
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select or create a college'
      });
    }

    // Handle referral code if provided
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ 
        'studentProfile.referralCode': referralCode,
        role: 'student'
      });
    }

    // Create student user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'student',
      college: college._id,
      studentProfile: {
        miningColleges: [{
          college: college._id,
          addedAt: new Date()
        }],
        referredBy: referredByUser ? referredByUser._id : null,
        baseEarningRate: 0.25,
        referralBonus: 0
      }
    });

    // Update college createdBy if it was just created by this student
    if (!collegeId && newCollege) {
      await College.findByIdAndUpdate(college._id, {
        createdBy: user._id
      });
    }

    // Update referrer's referral count and bonus if applicable
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: {
          'studentProfile.totalReferrals': 1,
          'studentProfile.referralBonus': 0.1
        }
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      college: college,
      studentProfile: user.studentProfile
    };

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new college admin
// @route   POST /api/auth/register/college
// @access  Public
export const registerCollegeAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, password, collegeId, newCollege } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password'
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

    let college;

    // Handle college selection/creation
    if (collegeId) {
      // Admin selected existing college
      college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }

      // Check if college already has an admin
      if (college.admin) {
        return res.status(400).json({
          success: false,
          message: 'This college already has an admin. Only one admin per college is allowed.'
        });
      }
    } else if (newCollege) {
      // Admin is creating a new college
      const { name: collegeName, country, logo } = newCollege;
      
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

      if (existingCollege) {
        // College exists, check if it has admin
        if (existingCollege.admin) {
          return res.status(400).json({
            success: false,
            message: 'This college already has an admin. Only one admin per college is allowed.'
          });
        }
        college = existingCollege;
      } else {
        // Create new college
        college = await College.create({
          name: collegeName,
          country,
          logo: logo || null,
          isOnWaitlist: true
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select or create a college'
      });
    }

    // Create college admin user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'college_admin',
      managedCollege: college._id
    });

    // Update college with admin reference
    await College.findByIdAndUpdate(college._id, {
      admin: user._id
    });

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      managedCollege: college
    };

    res.status(201).json({
      success: true,
      message: 'College admin registered successfully',
      data: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (student, college admin, or platform admin)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for hardcoded platform admin
    if (email === 'admin@gmail.com' && password === '123456') {
      // Check if platform admin exists in DB
      let adminUser = await User.findOne({ email: 'admin@gmail.com', role: 'platform_admin' });
      
      if (!adminUser) {
        // Create platform admin if doesn't exist
        adminUser = await User.create({
          name: 'Platform Admin',
          email: 'admin@gmail.com',
          phone: '0000000000',
          password: '123456',
          role: 'platform_admin'
        });
      }

      // Generate token
      const token = generateToken(adminUser._id, adminUser.role);

      // Update last login
      await User.findByIdAndUpdate(adminUser._id, { lastLogin: new Date() });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        },
        token
      });
    }

    // Find user by email and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Prepare user data based on role
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    // Populate college/managed college data
    if (user.role === 'student') {
      await user.populate('college', 'name country logo stats');
      await user.populate('studentProfile.miningColleges.college', 'name country logo stats');
      userData.college = user.college;
      userData.studentProfile = user.studentProfile;
    } else if (user.role === 'college_admin') {
      await user.populate('managedCollege');
      userData.managedCollege = user.managedCollege;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare user data based on role
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    // Populate college/managed college data
    if (user.role === 'student') {
      await user.populate('college', 'name country logo stats');
      await user.populate('studentProfile.miningColleges.college', 'name country logo stats');
      userData.college = user.college;
      userData.studentProfile = user.studentProfile;
    } else if (user.role === 'college_admin') {
      await user.populate('managedCollege');
      userData.managedCollege = user.managedCollege;
    }

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // In JWT-based auth, logout is handled client-side by removing token
    // But we can still track it server-side if needed
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

