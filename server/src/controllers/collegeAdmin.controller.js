import mongoose from 'mongoose';
import College from '../models/College.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import MiningSession from '../models/Mining.js';
import ScholarshipWallet from '../models/ScholarshipWallet.js';
import ScholarshipTransaction from '../models/ScholarshipTransaction.js';
import Document from '../models/Document.js';
import Folder from '../models/Folder.js';
import ScholarshipOffer from '../models/ScholarshipOffer.js';
import StudentOfferResponse from '../models/StudentOfferResponse.js';
import Notification from '../models/Notification.js';
import path from 'path';
import { createBulkNotifications } from '../services/notification.service.js';

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
    const updatedCollege = await College.findByIdAndUpdate(college._id, {
      admin: admin._id,
      status: 'Waitlist' // Move to Waitlist when admin joins
    }, { new: true });

    // Notify all users mining for this college about status change
    const minersIds = await User.find({
      role: 'user',
      'userProfile.miningColleges.college': college._id
    }).distinct('_id');

    if (minersIds.length > 0) {
      const notifications = minersIds.map(userId => ({
        recipient: userId,
        type: 'college_status_changed',
        title: `${college.name} has an admin!`,
        message: `Great news! ${college.name} now has an official admin and has been moved to the waitlist. Your college is one step closer to launching its token!`,
        data: {
          collegeId: college._id,
          collegeName: college.name,
          newStatus: 'Waitlist',
          oldStatus: 'Unaffiliated'
        },
        category: 'college',
        priority: 'high',
        actionUrl: '/user/dashboard'
      }));

      await createBulkNotifications(notifications);
    }

    res.status(200).json({
      success: true,
      message: 'College selected successfully',
      data: {
        college: updatedCollege
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

    // Get all miners (users who have added this college to their mining list)
    const totalMiners = await User.countDocuments({
      role: 'user',
      'userProfile.miningColleges.college': college._id
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

    // Update college stats (activeMiners is maintained by mining operations only)
    college.stats.totalMiners = totalMiners;
    college.stats.totalTokensMined = totalTokensMined;
    // Note: activeMiners is NOT modified here - it's maintained by atomic increment/decrement in start/stop mining
    await college.save();

    res.status(200).json({
      success: true,
      data: {
        college,
        activeMinersCount: college.stats.activeMiners,
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
            // Delete invalid JSON strings instead of corrupting the database
            console.warn(`Failed to parse ${field}, removing from update:`, req.body[field]);
            // Don't add this field to updateData
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // Sanitize array fields - ensure they are not empty strings
    const arrayFields = ['images', 'accreditations', 'rankings', 'programs', 'highlights', 'facilities'];
    arrayFields.forEach(field => {
      if (updateData[field] === '') {
        delete updateData[field]; // Use existing value or default
      }
      
      // Also check req.body in case it wasn't copied to updateData yet
      if (req.body[field] !== undefined) {
         if (req.body[field] === '') {
             // If frontend sent empty string, it likely means "empty"
             // But for arrays, we should probably ignore it or set to [], 
             // but deleting it is safer if we just want to avoid the crash.
             // If we want to clear the array, we should set to [].
             // However, based on the error, "" is being passed.
             // Let's set it to valid [] if it's meant to be cleared, or delete to ignore.
             // Given it's a PATCH-like update, ignoring (delete) is safer than clearing.
             // But if user meant to clear it, we should probably handle that? 
             // For now, let's just ensure we never pass "" to mongoose.
             delete updateData[field];
         } else if (Array.isArray(req.body[field])) {
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
    let {
      name,
      ticker,
      maximumSupply,
      preferredIcon,
      preferredLaunchDate,
      preferredUtilities,
      needExchangeListing,
      allocationForEarlyMiners
    } = req.body;

    // Parse preferredUtilities if it's a JSON string (from FormData)
    if (preferredUtilities !== undefined && typeof preferredUtilities === 'string') {
      try {
        preferredUtilities = JSON.parse(preferredUtilities);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid preferredUtilities format. Must be a valid JSON array.'
        });
      }
    }

    // Validate that preferredUtilities is an array if provided
    if (preferredUtilities !== undefined && !Array.isArray(preferredUtilities)) {
      return res.status(400).json({
        success: false,
        message: 'preferredUtilities must be an array'
      });
    }

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
          role: 'user',
          'userProfile.miningColleges.college': new mongoose.Types.ObjectId(collegeId)
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
      // Match users mining for this college
      {
        $match: {
          role: 'user',
          'userProfile.miningColleges.college': new mongoose.Types.ObjectId(collegeId)
        }
      },
      // Lookup wallet data
      {
        $lookup: {
          from: 'wallets',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$userId'] },
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
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$userId'] },
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
      // Unwind arrays (use preserveNullAndEmptyArrays to keep users without wallet/session)
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
          referralCode: '$userProfile.referralCode',
          totalReferrals: '$userProfile.totalReferrals',
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
          totalUsers: college.stats?.totalMiners || 0,
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

// ==================== STUDENT BROWSING ENDPOINTS ====================

// @desc    Browse students with filters
// @route   GET /api/college-admin/students
// @access  Private (College Admin only)
export const getStudents = async (req, res, next) => {
  try {
    const {
      country,
      gradeLevel,
      minPoints,
      maxPoints,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build query for students only
    const query = {
      role: 'student',
      isActive: true
    };

    // Filter by country if provided
    if (country) {
      query['userProfile.country'] = { $regex: new RegExp(country, 'i') };
    }

    // Filter by grade level if provided
    if (gradeLevel) {
      query['userProfile.gradeLevel'] = gradeLevel;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get all matching students first
    let students = await User.find(query)
      .select('name email phone userProfile.country userProfile.gradeLevel createdAt')
      .lean();

    // Get scholarship wallets for all students
    const studentIds = students.map(s => s._id);
    const wallets = await ScholarshipWallet.find({ user: { $in: studentIds } }).lean();
    const walletMap = new Map(wallets.map(w => [w.user.toString(), w]));

    // Attach wallet data and filter by points if needed
    students = students.map(student => {
      const wallet = walletMap.get(student._id.toString());
      return {
        ...student,
        scholarshipWallet: {
          balance: wallet?.balance || 0,
          totalEarned: wallet?.totalEarned || 0
        }
      };
    });

    // Filter by points range if provided
    if (minPoints !== undefined || maxPoints !== undefined) {
      students = students.filter(student => {
        const balance = student.scholarshipWallet.balance;
        if (minPoints !== undefined && balance < parseFloat(minPoints)) return false;
        if (maxPoints !== undefined && balance > parseFloat(maxPoints)) return false;
        return true;
      });
    }

    // Sort by balance descending
    students.sort((a, b) => b.scholarshipWallet.balance - a.scholarshipWallet.balance);

    // Apply pagination
    const total = students.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedStudents = students.slice(startIndex, startIndex + parseInt(limit));

    res.status(200).json({
      success: true,
      data: paginatedStudents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student details with scholarship wallet
// @route   GET /api/college-admin/students/:id
// @access  Private (College Admin only)
export const getStudentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is a student OR has accepted an offer from this college
    const acceptedOffer = await StudentOfferResponse.findOne({
      student: id,
      status: 'accepted'
    }).populate('offer');

    const hasAcceptedFromThisCollege = acceptedOffer &&
      acceptedOffer.offer?.college?.toString() === req.user.managedCollege?.toString();

    const student = await User.findOne({
      _id: id,
      $or: [
        { role: 'student' },
        ...(hasAcceptedFromThisCollege ? [{ _id: id }] : [])
      ]
    }).select('name email phone userProfile createdAt lastLogin');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get scholarship wallet
    const wallet = await ScholarshipWallet.findOne({ user: id });

    // Get document counts
    const documentCount = await Document.countDocuments({ user: id, isPublic: true });
    const folderCount = await Folder.countDocuments({ user: id });

    res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          country: student.userProfile?.country,
          gradeLevel: student.userProfile?.gradeLevel,
          referralCode: student.userProfile?.referralCode,
          totalReferrals: student.userProfile?.totalReferrals || 0,
          createdAt: student.createdAt,
          lastLogin: student.lastLogin
        },
        scholarshipWallet: {
          balance: wallet?.balance || 0,
          totalEarned: wallet?.totalEarned || 0,
          totalSpent: wallet?.totalSpent || 0
        },
        documents: {
          publicCount: documentCount,
          folderCount: folderCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's scholarship points history
// @route   GET /api/college-admin/students/:id/points-history
// @access  Private (College Admin only)
export const getStudentPointsHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, type, source } = req.query;

    // Verify student exists
    const student = await User.findOne({
      _id: id,
      role: { $in: ['student', 'user'] }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Build query
    const query = { user: id };
    if (type) query.type = type;
    if (source) query.source = source;

    const transactions = await ScholarshipTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const total = await ScholarshipTransaction.countDocuments(query);

    // Get summary stats
    const summary = await ScholarshipTransaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$source',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        summary
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's public documents
// @route   GET /api/college-admin/students/:id/documents
// @access  Private (College Admin only)
export const getStudentDocuments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is a student OR has accepted an offer from this college
    const acceptedOffer = await StudentOfferResponse.findOne({
      student: id,
      status: 'accepted'
    }).populate('offer');

    const hasAcceptedFromThisCollege = acceptedOffer &&
      acceptedOffer.offer?.college?.toString() === req.user.managedCollege?.toString();

    const student = await User.findOne({
      _id: id,
      $or: [
        { role: 'student' },
        ...(hasAcceptedFromThisCollege ? [{ _id: id }] : [])
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get ALL public documents for this student (flat list, no folder filtering)
    const query = {
      user: id,
      isPublic: true
    };

    const documents = await Document.find(query)
      .populate('folder', 'name path')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        documents
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get students who have accepted offers from this college
// @route   GET /api/college-admin/accepted-students
// @access  Private (College Admin only)
export const getAcceptedStudents = async (req, res, next) => {
  try {
    const collegeId = req.user.managedCollege;
    const { search, page = 1, limit = 25 } = req.query;

    // Find all accepted responses for offers from this college
    const matchStage = {
      status: 'accepted'
    };

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'scholarshipoffers',
          localField: 'offer',
          foreignField: '_id',
          as: 'offerData'
        }
      },
      { $unwind: '$offerData' },
      { $match: { 'offerData.college': new mongoose.Types.ObjectId(collegeId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      { $unwind: '$studentData' }
    ];

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'studentData.name': { $regex: search, $options: 'i' } },
            { 'studentData.email': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await StudentOfferResponse.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination and projection
    pipeline.push(
      { $sort: { respondedAt: -1, updatedAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          status: 1,
          respondedAt: 1,
          updatedAt: 1,
          student: {
            _id: '$studentData._id',
            name: '$studentData.name',
            email: '$studentData.email'
          },
          offer: {
            _id: '$offerData._id',
            title: '$offerData.title',
            totalValue: '$offerData.totalValue',
            currency: '$offerData.currency'
          }
        }
      }
    );

    const responses = await StudentOfferResponse.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: responses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== OFFER MANAGEMENT ENDPOINTS ====================

// Helper function to generate letter template
const generateLetterTemplate = (collegeName, offerTitle, totalValue, currency) => {
  return `Dear [Student Name],

We are pleased to inform you that ${collegeName} is offering you a scholarship opportunity.

Scholarship Details:
- Title: ${offerTitle}
- Value: ${currency} ${totalValue.toLocaleString()}

This scholarship recognizes your exceptional achievements and potential. We believe you will be a valuable addition to our academic community.

To accept this offer, please review the terms and conditions and submit the required documents through the application portal.

We look forward to welcoming you to ${collegeName}.

Sincerely,
The Admissions Office
${collegeName}`;
};

// @desc    Get letter template for offer creation
// @route   GET /api/college-admin/offers/letter-template
// @access  Private (College Admin only)
export const getLetterTemplate = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id).populate('managedCollege');

    if (!admin.managedCollege) {
      return res.status(400).json({
        success: false,
        message: 'You must select a college first'
      });
    }

    const template = generateLetterTemplate(
      admin.managedCollege.name,
      '[Scholarship Title]',
      0,
      'USD'
    );

    res.status(200).json({
      success: true,
      data: { template }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new scholarship offer
// @route   POST /api/college-admin/offers
// @access  Private (College Admin only)
export const createOffer = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id).populate('managedCollege');

    if (!admin.managedCollege) {
      return res.status(400).json({
        success: false,
        message: 'You must select a college first'
      });
    }

    const {
      title,
      totalValue,
      currency,
      terms,
      description,
      formalLetter,
      requiredDocuments,
      targeting,
      status,
      expiryDate,
      isRecommended
    } = req.body;

    // Validate required fields
    if (!title || totalValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title and total value are required'
      });
    }

    // Check recommended offer limit (5 per month)
    if (isRecommended) {
      const college = admin.managedCollege;
      const now = new Date();
      const resetDate = college.recommendedOffersResetDate;

      // Check if we need to reset the counter (new month)
      if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
        // Reset counter for new month
        await College.findByIdAndUpdate(college._id, {
          recommendedOffersUsedThisMonth: 0,
          recommendedOffersResetDate: now
        });
        college.recommendedOffersUsedThisMonth = 0;
      }

      if (college.recommendedOffersUsedThisMonth >= 5) {
        return res.status(400).json({
          success: false,
          message: 'You have used all 5 recommended offer slots for this month'
        });
      }
    }

    // Generate letter if not provided
    const letter = formalLetter || generateLetterTemplate(
      admin.managedCollege.name,
      title,
      totalValue,
      currency || 'USD'
    );

    const offer = new ScholarshipOffer({
      college: admin.managedCollege._id,
      createdBy: admin._id,
      title,
      totalValue,
      currency: currency || 'USD',
      terms: terms || '',
      description: description || '',
      formalLetter: letter,
      requiredDocuments: requiredDocuments || [],
      targeting: targeting || { type: 'all' },
      status: status || 'draft',
      expiryDate: expiryDate || null,
      isRecommended: isRecommended || false
    });

    await offer.save();

    // Update recommended offers counter if applicable
    if (isRecommended) {
      await College.findByIdAndUpdate(admin.managedCollege._id, {
        $inc: { recommendedOffersUsedThisMonth: 1 }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all offers for the college
// @route   GET /api/college-admin/offers
// @access  Private (College Admin only)
export const getOffers = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin.managedCollege) {
      return res.status(400).json({
        success: false,
        message: 'You must select a college first'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;

    const query = { college: admin.managedCollege };
    if (status) query.status = status;

    const offers = await ScholarshipOffer.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    // Get response counts for each offer
    const offersWithCounts = await Promise.all(offers.map(async (offer) => {
      const responseCounts = await StudentOfferResponse.aggregate([
        { $match: { offer: offer._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const counts = {
        pending: 0,
        accepted: 0,
        rejected: 0
      };
      responseCounts.forEach(r => {
        counts[r._id] = r.count;
      });

      return {
        ...offer,
        responseCounts: counts,
        totalResponses: counts.pending + counts.accepted + counts.rejected
      };
    }));

    const total = await ScholarshipOffer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: offersWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single offer details
// @route   GET /api/college-admin/offers/:id
// @access  Private (College Admin only)
export const getOfferDetails = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const { id } = req.params;

    const offer = await ScholarshipOffer.findOne({
      _id: id,
      college: admin.managedCollege
    }).populate('createdBy', 'name email');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Get response summary
    const responseCounts = await StudentOfferResponse.aggregate([
      { $match: { offer: offer._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = { pending: 0, accepted: 0, rejected: 0 };
    responseCounts.forEach(r => {
      counts[r._id] = r.count;
    });

    res.status(200).json({
      success: true,
      data: {
        offer,
        responseCounts: counts,
        totalResponses: counts.pending + counts.accepted + counts.rejected
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an offer
// @route   PUT /api/college-admin/offers/:id
// @access  Private (College Admin only)
export const updateOffer = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id).populate('managedCollege');
    const { id } = req.params;

    const offer = await ScholarshipOffer.findOne({
      _id: id,
      college: admin.managedCollege._id
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const {
      title,
      totalValue,
      currency,
      terms,
      description,
      formalLetter,
      requiredDocuments,
      targeting,
      status,
      expiryDate,
      isRecommended
    } = req.body;

    // Handle recommended status change
    if (isRecommended !== undefined && isRecommended !== offer.isRecommended) {
      if (isRecommended) {
        // Turning on recommended - check limit
        const college = admin.managedCollege;
        const now = new Date();
        const resetDate = college.recommendedOffersResetDate;

        if (!resetDate || resetDate.getMonth() !== now.getMonth() || resetDate.getFullYear() !== now.getFullYear()) {
          await College.findByIdAndUpdate(college._id, {
            recommendedOffersUsedThisMonth: 0,
            recommendedOffersResetDate: now
          });
          college.recommendedOffersUsedThisMonth = 0;
        }

        if (college.recommendedOffersUsedThisMonth >= 5) {
          return res.status(400).json({
            success: false,
            message: 'You have used all 5 recommended offer slots for this month'
          });
        }

        await College.findByIdAndUpdate(college._id, {
          $inc: { recommendedOffersUsedThisMonth: 1 }
        });
      } else {
        // Turning off recommended - decrement counter
        await College.findByIdAndUpdate(admin.managedCollege._id, {
          $inc: { recommendedOffersUsedThisMonth: -1 }
        });
      }
    }

    // Update fields
    if (title !== undefined) offer.title = title;
    if (totalValue !== undefined) offer.totalValue = totalValue;
    if (currency !== undefined) offer.currency = currency;
    if (terms !== undefined) offer.terms = terms;
    if (description !== undefined) offer.description = description;
    if (formalLetter !== undefined) offer.formalLetter = formalLetter;
    if (requiredDocuments !== undefined) offer.requiredDocuments = requiredDocuments;
    if (targeting !== undefined) offer.targeting = targeting;
    if (status !== undefined) offer.status = status;
    if (expiryDate !== undefined) offer.expiryDate = expiryDate;
    if (isRecommended !== undefined) offer.isRecommended = isRecommended;

    await offer.save();

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/cancel an offer
// @route   DELETE /api/college-admin/offers/:id
// @access  Private (College Admin only)
export const deleteOffer = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const { id } = req.params;

    const offer = await ScholarshipOffer.findOne({
      _id: id,
      college: admin.managedCollege
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if there are any accepted responses
    const acceptedCount = await StudentOfferResponse.countDocuments({
      offer: id,
      status: 'accepted'
    });

    if (acceptedCount > 0) {
      // Don't delete, just mark as cancelled
      offer.status = 'cancelled';
      await offer.save();

      return res.status(200).json({
        success: true,
        message: 'Offer has been cancelled (not deleted because students have accepted it)',
        data: offer
      });
    }

    // If recommended, decrement counter
    if (offer.isRecommended) {
      await College.findByIdAndUpdate(admin.managedCollege, {
        $inc: { recommendedOffersUsedThisMonth: -1 }
      });
    }

    // Delete all pending responses
    await StudentOfferResponse.deleteMany({ offer: id });

    // Delete the offer
    await ScholarshipOffer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get responses for an offer
// @route   GET /api/college-admin/offers/:id/responses
// @access  Private (College Admin only)
export const getOfferResponses = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const { id } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // Verify offer belongs to this college
    const offer = await ScholarshipOffer.findOne({
      _id: id,
      college: admin.managedCollege
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const query = { offer: id };
    if (status) query.status = status;

    const responses = await StudentOfferResponse.find(query)
      .populate('student', 'name email phone userProfile.country userProfile.gradeLevel')
      .populate('submittedDocuments.document', 'name url fileType mimeType')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await StudentOfferResponse.countDocuments(query);

    res.status(200).json({
      success: true,
      data: responses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

