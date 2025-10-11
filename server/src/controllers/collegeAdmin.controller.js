import mongoose from 'mongoose';
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
    const {
      name, country, logo, coverImage, description, website, establishedYear, additionalInfo,
      shortName, tagline, type, state, city, address, zipCode, videoUrl, about, mission, vision, email, phone
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (country) updateData.country = country;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (establishedYear !== undefined) updateData.establishedYear = establishedYear;
    if (additionalInfo !== undefined) updateData.additionalInfo = additionalInfo;
    if (shortName !== undefined) updateData.shortName = shortName;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (type !== undefined) updateData.type = type;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (about !== undefined) updateData.about = about;
    if (mission !== undefined) updateData.mission = mission;
    if (vision !== undefined) updateData.vision = vision;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

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

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 100, 100); // Max 100 per page
    const skip = (page - 1) * limit;

    // Use aggregation pipeline to fetch all data in a single query
    const now = new Date();

    // First, get total count
    const totalCountPipeline = [
      {
        $match: {
          role: 'student',
          'studentProfile.miningColleges.college': new mongoose.Types.ObjectId(collegeId)
        }
      },
      {
        $count: 'total'
      }
    ];

    const countResult = await User.aggregate(totalCountPipeline);
    const totalMiners = countResult.length > 0 ? countResult[0].total : 0;

    // Then fetch paginated data
    const minersWithWallets = await User.aggregate([
      // Match students mining for this college
      {
        $match: {
          role: 'student',
          'studentProfile.miningColleges.college': new mongoose.Types.ObjectId(collegeId)
        }
      },
      // Lookup wallet data
      {
        $lookup: {
          from: 'wallets',
          let: { studentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    { $eq: ['$college', new mongoose.Types.ObjectId(collegeId)] }
                  ]
                }
              }
            }
          ],
          as: 'wallet'
        }
      },
      // Lookup active mining session
      {
        $lookup: {
          from: 'miningsessions',
          let: { studentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    { $eq: ['$college', new mongoose.Types.ObjectId(collegeId)] },
                    { $eq: ['$isActive', true] }
                  ]
                }
              }
            }
          ],
          as: 'activeMining'
        }
      },
      // Unwind arrays (use preserveNullAndEmptyArrays to keep miners without wallet/session)
      {
        $addFields: {
          wallet: { $arrayElemAt: ['$wallet', 0] },
          activeMining: { $arrayElemAt: ['$activeMining', 0] }
        }
      },
      // Calculate current mining tokens
      {
        $addFields: {
          currentMiningTokens: {
            $cond: {
              if: '$activeMining',
              then: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: [now, '$activeMining.startTime'] },
                      3600000 // milliseconds in an hour
                    ]
                  },
                  '$activeMining.earningRate'
                ]
              },
              else: 0
            }
          }
        }
      },
      // Project final shape
      {
        $project: {
          id: '$_id',
          name: 1,
          email: 1,
          referralCode: '$studentProfile.referralCode',
          totalReferrals: '$studentProfile.totalReferrals',
          tokensMined: {
            $add: [
              { $ifNull: ['$wallet.balance', 0] },
              '$currentMiningTokens'
            ]
          },
          status: {
            $cond: {
              if: '$activeMining',
              then: 'active',
              else: 'idle'
            }
          },
          joinedAt: '$createdAt'
        }
      },
      // Sort by tokens mined descending
      {
        $sort: { tokensMined: -1 }
      },
      // Pagination
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    // Get college to check if it's new
    const college = await College.findById(collegeId);
    const isNewCollege = totalMiners === 0;

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
        totalMiners: totalMiners,
        totalTokensMined: college.stats.totalTokensMined,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMiners / limit),
          pageSize: limit,
          hasNextPage: page < Math.ceil(totalMiners / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get college leaderboard
// @route   GET /api/college-admin/leaderboard
// @access  Private (College Admin only)
export const getLeaderboard = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const collegeId = admin.managedCollege;
    const { search } = req.query;

    // Get ALL colleges sorted by total tokens mined (for global ranking)
    const allColleges = await College.find()
      .select('name country state city description logo stats baseRate')
      .sort({ 'stats.totalTokensMined': -1 })
      .lean();

    // Assign global ranks and get active sessions for each college
    const collegesWithData = await Promise.all(
      allColleges.map(async (college, index) => {
        const activeSessions = await MiningSession.countDocuments({
          college: college._id,
          isActive: true
        });

        return {
          rank: index + 1,
          id: college._id,
          name: college.name,
          location: `${college.city || ''}${college.city && college.state ? ', ' : ''}${college.state || ''}${(college.city || college.state) && college.country ? ', ' : ''}${college.country || ''}`.trim() || 'Location not set',
          logo: college.logo,
          totalStudents: college.stats?.totalMiners || 0,
          activeMiningSessions: activeSessions,
          totalTokensMined: college.stats?.totalTokensMined || 0,
          miningRate: college.baseRate || 0,
          country: college.country,
          state: college.state,
          city: college.city,
          description: college.description
        };
      })
    );

    // Apply search filter AFTER ranks are assigned
    let filteredColleges = collegesWithData;
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredColleges = collegesWithData.filter(college =>
        college.name.toLowerCase().includes(searchLower) ||
        college.country?.toLowerCase().includes(searchLower) ||
        college.state?.toLowerCase().includes(searchLower) ||
        college.city?.toLowerCase().includes(searchLower) ||
        college.description?.toLowerCase().includes(searchLower)
      );
    }

    // Find current college in GLOBAL ranking
    const currentCollegeIndex = collegesWithData.findIndex(c => c.id.toString() === collegeId.toString());
    const currentCollege = collegesWithData[currentCollegeIndex];

    // Get top 10 from filtered results
    const top10 = filteredColleges.slice(0, 10);

    // Determine what to return
    let result = {
      top10,
      currentCollege: null,
      context: []
    };

    // If current college is not in top 10 of GLOBAL ranking, add it with context
    if (currentCollegeIndex >= 10) {
      result.currentCollege = currentCollege;

      // Get 2 colleges above and 2 below current college from GLOBAL ranking
      const contextStart = Math.max(10, currentCollegeIndex - 2);
      const contextEnd = Math.min(collegesWithData.length, currentCollegeIndex + 3);
      result.context = collegesWithData.slice(contextStart, contextEnd);
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

