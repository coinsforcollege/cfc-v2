import User from '../models/User.js';
import College from '../models/College.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Register a new student
// @route   POST /api/auth/register/student
// @access  Public
export const registerStudent = async (req, res, next) => {
  try {
    const { name, email, phone, password, referralCode, collegeId } = req.body;

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

    // Validate college if collegeId provided
    let college = null;
    if (collegeId) {
      college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({
          success: false,
          message: 'College not found'
        });
      }
    }

    // Handle referral code if provided
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({
        'studentProfile.referralCode': referralCode,
        role: 'student'
      });

      if (!referredByUser) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
    }

    // Prepare student profile
    const studentProfile = {
      miningColleges: [],
      referredBy: referredByUser ? referredByUser._id : null,
      referredForCollege: null
    };

    // If college is provided, add it to mining list
    if (college) {
      studentProfile.miningColleges.push({
        college: college._id,
        addedAt: new Date(),
        referredStudents: []
      });

      // If there's also a referral code, set referredForCollege
      if (referredByUser) {
        studentProfile.referredForCollege = college._id;
      }
    }

    // Create student user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'student',
      college: college ? college._id : null, // Set primary college if provided
      studentProfile
    });

    // Update referrer's data if applicable
    if (referredByUser && college) {
      // Increment total referrals count
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { 'studentProfile.totalReferrals': 1 }
      });

      // Add this student to the referrer's referredStudents for the specific college
      const referrerCollegeIndex = referredByUser.studentProfile.miningColleges.findIndex(
        mc => mc.college.toString() === college._id.toString()
      );

      if (referrerCollegeIndex !== -1) {
        // Referrer has this college in their list, add to referredStudents
        await User.findOneAndUpdate(
          {
            _id: referredByUser._id,
            'studentProfile.miningColleges.college': college._id
          },
          {
            $push: {
              'studentProfile.miningColleges.$.referredStudents': {
                student: user._id,
                referredAt: new Date()
              }
            }
          }
        );
      } else {
        // Referrer doesn't have this college yet, add it with the referred student
        await User.findByIdAndUpdate(referredByUser._id, {
          $push: {
            'studentProfile.miningColleges': {
              college: college._id,
              addedAt: new Date(),
              referredStudents: [{
                student: user._id,
                referredAt: new Date()
              }]
            }
          }
        });
      }
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Populate college data for response
    if (college) {
      await user.populate('college', 'name country logo stats baseRate referralBonusRate');
      await user.populate('studentProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');
    }

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      college: user.college,
      studentProfile: {
        miningColleges: user.studentProfile.miningColleges,
        referredBy: user.studentProfile.referredBy,
        referredForCollege: user.studentProfile.referredForCollege,
        totalReferrals: user.studentProfile.totalReferrals,
        referralCode: user.studentProfile.referralCode
      }
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

    let college = null;

    // Handle college selection/creation (optional during registration)
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
      const collegeData = JSON.parse(newCollege);
      const { name: collegeName, country, logo } = collegeData;
      
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
          name: collegeName,
          country,
          logo: logoPath,
          status: 'Unaffiliated'
        });
      }
    }

    // Create college admin user (with or without college)
    const userPayload = {
      name,
      email,
      phone,
      password,
      role: 'college_admin'
    };

    // Add managedCollege only if college was selected/created
    if (college) {
      userPayload.managedCollege = college._id;
    }

    const user = await User.create(userPayload);

    // Update college with admin reference and status if college was selected/created
    if (college) {
      await College.findByIdAndUpdate(college._id, {
        admin: user._id,
        status: 'Waitlist' // Move to Waitlist when admin joins
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
      await user.populate('college', 'name country logo stats baseRate referralBonusRate');
      await user.populate('studentProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');

      // Filter out null colleges (deleted colleges)
      const validMiningColleges = user.studentProfile.miningColleges.filter(mc => mc.college !== null);

      userData.college = user.college;
      userData.studentProfile = {
        miningColleges: validMiningColleges,
        referredBy: user.studentProfile.referredBy,
        referredForCollege: user.studentProfile.referredForCollege,
        totalReferrals: user.studentProfile.totalReferrals,
        referralCode: user.studentProfile.referralCode
      };
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
      await user.populate('college', 'name country logo stats baseRate referralBonusRate');
      await user.populate('studentProfile.miningColleges.college', 'name country logo stats baseRate referralBonusRate');

      // Filter out null colleges (deleted colleges)
      const validMiningColleges = user.studentProfile.miningColleges.filter(mc => mc.college !== null);

      userData.college = user.college;
      userData.studentProfile = {
        miningColleges: validMiningColleges,
        referredBy: user.studentProfile.referredBy,
        referredForCollege: user.studentProfile.referredForCollege,
        totalReferrals: user.studentProfile.totalReferrals,
        referralCode: user.studentProfile.referralCode
      };
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already in use'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    // Prepare response based on role
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    if (user.role === 'student') {
      await user.populate('college', 'name country logo');
      userData.college = user.college;
      userData.studentProfile = {
        referralCode: user.studentProfile.referralCode,
        totalReferrals: user.studentProfile.totalReferrals
      };
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
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

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};