import College from '../models/College.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import MiningSession from '../models/Mining.js';
import path from 'path';

// @desc    Select or create college for admin
// @route   POST /api/college-admin/select-college
// @access  Private (College Admin only)
export const selectCollege = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);

    // Check if admin already has a college
    if (admin.managedCollege) {
      return res.status(400).json({
        success: false,
        message: 'You have already selected a college'
      });
    }

    const { collegeId, newCollege } = req.body;
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
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select or create a college'
      });
    }

    // Update admin with college reference
    admin.managedCollege = college._id;
    await admin.save();

    // Update college with admin reference and status
    await College.findByIdAndUpdate(college._id, {
      admin: admin._id,
      status: 'Waitlist' // Move to Waitlist when admin joins
    });

    res.status(200).json({
      success: true,
      message: 'College selected successfully',
      data: {
        college: college
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get college admin dashboard
// @route   GET /api/college-admin/dashboard
// @access  Private (College Admin only)
export const getDashboard = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id).populate('managedCollege');

    if (!admin.managedCollege) {
      return res.status(404).json({
        success: false,
        message: 'No college associated with this admin'
      });
    }

    const college = admin.managedCollege;

    // Get all miners (students who have added this college to their mining list)
    const totalMiners = await User.countDocuments({
      role: 'student',
      'studentProfile.miningColleges.college': college._id
    });

    // Get active miners (students with active mining sessions)
    const activeMiningCount = await MiningSession.countDocuments({
      college: college._id,
      isActive: true
    });

    // Calculate total tokens mined from all wallets
    const wallets = await Wallet.find({ college: college._id });
    const walletBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    // Add tokens from active mining sessions
    const activeSessions = await MiningSession.find({
      college: college._id,
      isActive: true
    });

    const now = new Date();
    const activeSessionTokens = activeSessions.reduce((sum, session) => {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60); // in hours
      const currentTokens = miningDuration * session.earningRate;
      return sum + currentTokens;
    }, 0);

    const totalTokensMined = walletBalance + activeSessionTokens;

    // Update college stats
    college.stats = {
      totalMiners,
      activeMiners: activeMiningCount,
      totalTokensMined
    };
    await college.save();

    res.status(200).json({
      success: true,
      data: {
        college,
        activeMinersCount: activeMiningCount,
        stats: college.stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college basic details
// @route   PUT /api/college-admin/college/details
// @access  Private (College Admin only)
export const updateCollegeDetails = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const { name, country, logo, coverImage, description, website, establishedYear, additionalInfo } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (country) updateData.country = country;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (establishedYear !== undefined) updateData.establishedYear = establishedYear;
    if (additionalInfo !== undefined) updateData.additionalInfo = additionalInfo;

    // Parse JSON fields if they are strings (from FormData)
    const jsonFields = ['socialMedia', 'departments', 'tokenPreferences', 'campusSize', 'studentLife'];
    jsonFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'string') {
          try {
            updateData[field] = JSON.parse(req.body[field]);
          } catch (e) {
            // ignore parse error
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // Handle file uploads (req.files contains logoFile and/or coverFile)
    if (req.files) {
      if (req.files.logoFile && req.files.logoFile[0]) {
        updateData.logo = `/images/logo/${req.files.logoFile[0].filename}`;
      }
      if (req.files.coverFile && req.files.coverFile[0]) {
        updateData.coverImage = `/images/cover/${req.files.coverFile[0].filename}`;
      }
    }

    // Handle URL inputs (ONLY if non-empty string provided and no file was uploaded)
    if (!updateData.logo && logo && logo.trim() !== '') {
      updateData.logo = logo;
    }
    if (!updateData.coverImage && coverImage && coverImage.trim() !== '') {
      updateData.coverImage = coverImage;
    }

    const college = await College.findByIdAndUpdate(
      admin.managedCollege,
      updateData,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'College details updated successfully',
      data: college
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update token preferences
// @route   PUT /api/college-admin/college/token-preferences
// @access  Private (College Admin only)
export const updateTokenPreferences = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const {
      name,
      ticker,
      maximumSupply,
      preferredIcon,
      preferredLaunchDate,
      preferredUtilities,
      needExchangeListing,
      allocationForEarlyMiners
    } = req.body;

    const tokenPreferences = {};
    if (name !== undefined) tokenPreferences['tokenPreferences.name'] = name;
    if (ticker !== undefined) tokenPreferences['tokenPreferences.ticker'] = ticker;
    if (maximumSupply !== undefined) tokenPreferences['tokenPreferences.maximumSupply'] = maximumSupply;
    if (preferredIcon !== undefined) tokenPreferences['tokenPreferences.preferredIcon'] = preferredIcon;
    if (preferredLaunchDate !== undefined) tokenPreferences['tokenPreferences.preferredLaunchDate'] = preferredLaunchDate;
    if (preferredUtilities !== undefined) tokenPreferences['tokenPreferences.preferredUtilities'] = preferredUtilities;
    if (needExchangeListing !== undefined) tokenPreferences['tokenPreferences.needExchangeListing'] = needExchangeListing;
    if (allocationForEarlyMiners !== undefined) tokenPreferences['tokenPreferences.allocationForEarlyMiners'] = allocationForEarlyMiners;

    const college = await College.findByIdAndUpdate(
      admin.managedCollege,
      tokenPreferences,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token preferences updated successfully',
      data: college.tokenPreferences
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add images to college
// @route   POST /api/college-admin/college/images
// @access  Private (College Admin only)
export const addCollegeImages = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of image URLs'
      });
    }

    const college = await College.findByIdAndUpdate(
      admin.managedCollege,
      { $push: { images: { $each: images } } },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Images added successfully',
      data: college.images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View community (active miners)
// @route   GET /api/college-admin/community
// @access  Private (College Admin only)
export const viewCommunity = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const collegeId = admin.managedCollege;

    // Get all students mining for this college
    const miners = await User.find({
      role: 'student',
      'studentProfile.miningColleges.college': collegeId
    })
      .select('name email studentProfile.referralCode studentProfile.totalReferrals createdAt')
      .sort({ 'studentProfile.totalReferrals': -1 });

    // Get wallet data and mining status for each miner
    const now = new Date();
    const minersWithWallets = await Promise.all(
      miners.map(async (miner) => {
        const wallet = await Wallet.findOne({
          student: miner._id,
          college: collegeId
        });

        // Check if miner has active mining session
        const activeMining = await MiningSession.findOne({
          student: miner._id,
          college: collegeId,
          isActive: true
        });

        // Calculate current mining tokens if session is active
        let currentMiningTokens = 0;
        if (activeMining) {
          const miningDuration = (now - activeMining.startTime) / (1000 * 60 * 60); // in hours
          currentMiningTokens = miningDuration * activeMining.earningRate;
        }

        return {
          id: miner._id,
          name: miner.name,
          email: miner.email,
          referralCode: miner.studentProfile.referralCode,
          totalReferrals: miner.studentProfile.totalReferrals,
          tokensMined: (wallet ? wallet.balance : 0) + currentMiningTokens,
          status: activeMining ? 'active' : 'idle',
          joinedAt: miner.createdAt
        };
      })
    );

    // Sort by tokens mined
    minersWithWallets.sort((a, b) => b.tokensMined - a.tokensMined);

    // Get college to check if it's new
    const college = await College.findById(collegeId);
    const isNewCollege = miners.length === 0;

    // If new college, return dummy data with message
    if (isNewCollege) {
      const dummyMiners = [
        {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          tokensMined: 125.5,
          totalReferrals: 8,
          isDummy: true
        },
        {
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          tokensMined: 98.25,
          totalReferrals: 5,
          isDummy: true
        },
        {
          name: 'Mike Chen',
          email: 'mike@example.com',
          tokensMined: 87.75,
          totalReferrals: 3,
          isDummy: true
        }
      ];

      return res.status(200).json({
        success: true,
        message: 'This is representational data only. Start promoting your college to see real miners!',
        isRepresentational: true,
        data: {
          miners: dummyMiners,
          totalMiners: 0,
          totalTokensMined: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      isRepresentational: false,
      data: {
        miners: minersWithWallets,
        totalMiners: miners.length,
        totalTokensMined: college.stats.totalTokensMined
      }
    });
  } catch (error) {
    next(error);
  }
};

