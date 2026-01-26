import User from '../models/User.js';
import ScholarshipWallet from '../models/ScholarshipWallet.js';
import StudentOfferResponse from '../models/StudentOfferResponse.js';
import { COUNTRIES, areValidCountries } from '../constants/countries.js';
import { deleteOldProfilePicture } from '../middlewares/upload.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Valid grade levels
const VALID_GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// @desc    Get student profile with all details
// @route   GET /api/student/profile
// @access  Private (Student only)
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('userProfile.followedColleges.college', 'name country logo coverImage')
      .populate('userProfile.interestedColleges.college', 'name country logo coverImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get scholarship wallet balance
    let walletBalance = 0;
    const wallet = await ScholarshipWallet.findOne({ user: userId });
    if (wallet) {
      walletBalance = wallet.balance;
    }

    // Get offer counts
    const offerCounts = await StudentOfferResponse.aggregate([
      { $match: { student: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const offers = {
      total: 0,
      active: 0,
      accepted: 0,
      rejected: 0
    };

    offerCounts.forEach(item => {
      offers[item._id] = item.count;
      offers.total += item.count;
    });

    // Filter out null colleges
    const followedColleges = user.userProfile.followedColleges?.filter(fc => fc.college) || [];
    const interestedColleges = user.userProfile.interestedColleges?.filter(ic => ic.college) || [];

    // Prepare profile response
    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      // Personal details
      country: user.userProfile.country,
      gradeLevel: user.userProfile.gradeLevel,
      school: user.userProfile.school || { name: null, address: null },
      desiredCollegeCountries: user.userProfile.desiredCollegeCountries || [],
      // Stats
      stats: {
        followedCollegesCount: followedColleges.length,
        interestedCollegesCount: interestedColleges.length,
        scholarshipPoints: walletBalance,
        offers: offers,
        collegeReadinessScore: 3 // Placeholder - not implemented yet
      },
      // College lists
      followedColleges: followedColleges,
      interestedColleges: interestedColleges,
      // Account status
      accountDeletionRequest: user.accountDeletionRequest?.status ? {
        status: user.accountDeletionRequest.status,
        requestedAt: user.accountDeletionRequest.requestedAt
      } : null,
      // Metadata
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student only)
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, country, gradeLevel, school, desiredCollegeCountries } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate and update name
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty'
        });
      }
      user.name = name.trim();
    }

    // Validate and update phone
    if (phone !== undefined) {
      if (phone && phone !== user.phone) {
        const existingUser = await User.findOne({ phone, _id: { $ne: userId } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Phone number already in use'
          });
        }
        user.phone = phone;
      }
    }

    // Validate and update country
    if (country !== undefined) {
      if (country !== null && !COUNTRIES.includes(country)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid country'
        });
      }
      user.userProfile.country = country;
    }

    // Validate and update grade level
    if (gradeLevel !== undefined) {
      if (gradeLevel !== null && !VALID_GRADE_LEVELS.includes(gradeLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid grade level. Must be K or 1-12'
        });
      }
      user.userProfile.gradeLevel = gradeLevel;
    }

    // Validate and update school
    if (school !== undefined) {
      if (school === null) {
        user.userProfile.school = { name: null, address: null };
      } else {
        if (typeof school !== 'object') {
          return res.status(400).json({
            success: false,
            message: 'School must be an object with name and address fields'
          });
        }
        user.userProfile.school = {
          name: school.name?.trim() || null,
          address: school.address?.trim() || null
        };
      }
    }

    // Validate and update desired college countries
    if (desiredCollegeCountries !== undefined) {
      if (desiredCollegeCountries === null) {
        user.userProfile.desiredCollegeCountries = [];
      } else {
        if (!Array.isArray(desiredCollegeCountries)) {
          return res.status(400).json({
            success: false,
            message: 'Desired college countries must be an array'
          });
        }
        if (!areValidCountries(desiredCollegeCountries)) {
          return res.status(400).json({
            success: false,
            message: 'One or more invalid countries in desired college countries'
          });
        }
        user.userProfile.desiredCollegeCountries = desiredCollegeCountries;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: user.name,
        phone: user.phone,
        country: user.userProfile.country,
        gradeLevel: user.userProfile.gradeLevel,
        school: user.userProfile.school,
        desiredCollegeCountries: user.userProfile.desiredCollegeCountries
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/student/profile-picture
// @access  Private (Student only)
export const uploadProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // The new file is already saved by multer with userId as name
    const profilePicturePath = `/images/user-avatar/${req.file.filename}`;
    const newFileExt = path.extname(req.file.filename).toLowerCase();

    // Delete old profile picture files (different extensions), but keep the new one
    await deleteOldProfilePicture(userId, newFileExt);

    // Update user's profile picture path
    await User.findByIdAndUpdate(userId, {
      profilePicture: profilePicturePath
    });

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: profilePicturePath
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile picture
// @route   DELETE /api/student/profile-picture
// @access  Private (Student only)
export const deleteProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.profilePicture) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete'
      });
    }

    // Delete the file
    await deleteOldProfilePicture(userId);

    // Update user
    user.profilePicture = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get countries list
// @route   GET /api/student/countries
// @access  Public
export const getCountries = async (req, res) => {
  res.status(200).json({
    success: true,
    data: COUNTRIES
  });
};

// @desc    Get grade levels list
// @route   GET /api/student/grade-levels
// @access  Public
export const getGradeLevels = async (req, res) => {
  res.status(200).json({
    success: true,
    data: VALID_GRADE_LEVELS
  });
};
