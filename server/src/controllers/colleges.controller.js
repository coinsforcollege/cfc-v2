import { Activity } from '../models/activity.model.js';
import { College } from '../models/college.models.js';
import { User } from '../models/userModels.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get colleges with search and filters
// @route   GET /api/colleges
// @access  Public
export const getColleges = async (req, res) => {
  const {
    q,
    state,
    type,
    sort = 'totalStudents',
    order = 'desc',
    page = 1,
    limit = 20
  } = req.query;

  // Build query
  let query = { status: 'active' };

  if (q) {
    query.name = { $regex: q, $options: 'i' };
  }

  if (state) {
    query['address.state'] = state;
  }

  if (type) {
    query.type = type;
  }

  // Build sort object
  let sortObj = {};
  switch (sort) {
    case 'name':
      sortObj.name = order === 'desc' ? -1 : 1;
      break;
    case 'totalStudents':
      sortObj['stats.totalStudents'] = order === 'desc' ? -1 : 1;
      break;
    case 'ranking':
      sortObj['stats.ranking'] = order === 'desc' ? -1 : 1;
      break;
    case 'newest':
      sortObj.createdAt = -1;
      break;
    default:
      sortObj['stats.totalStudents'] = -1;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const colleges = await College.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .select('name shortName logo address type stats badges adminStatus token.isConfigured hasVerifiedAdmin');

  const total = await College.countDocuments(query);

  res.status(200)
    .json(new ApiResponse(
      200,
      {
        colleges,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      'Colleges fetched successfully'
    ));
};

// @desc    Search colleges
// @route   GET /api/colleges/search
// @access  Public
export const searchColleges = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  const colleges = await College.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { shortName: { $regex: q, $options: 'i' } }
    ],
    status: 'active'
  })
    .select('name shortName logo address stats')
    .sort({ 'stats.totalStudents': -1 })
    .limit(10);

  res
    .status(200)
    .json(new ApiResponse(200, colleges, 'Colleges fetched successfully'));
};

// @desc    Get college by ID
// @route   GET /api/colleges/:id
// @access  Public
export const getCollegeById = async (req, res) => {
  const college = await College.findById(req.params.id)
    .populate('admin', 'firstName lastName position isAdminVerified');

  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  // Get recent students (public info only)
  const recentStudents = await User.find({
    college: college._id,
    role: 'student',
    isActive: true
  })
    .select('firstName lastName createdAt miningStreak totalTokensMined')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get top miners for this college
  const topMiners = await User.find({
    college: college._id,
    role: 'student',
    isActive: true
  })
    .select('firstName lastName totalTokensMined miningStreak')
    .sort({ totalTokensMined: -1 })
    .limit(10);

  // Increment view count
  await College.findByIdAndUpdate(req.params.id, {
    $inc: { 'analytics.views': 1 }
  });

  res.status(200)
    .json(new ApiResponse(
      200,
      {
        college,
        recentStudents,
        topMiners
      },
      'College fetched successfully'
    ));
};

// @desc    Get college statistics
// @route   GET /api/colleges/:id/stats
// @access  Public
export const getCollegeStats = async (req, res) => {

  const college = await College.findById(req.params.id);

  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  // Get mining stats for the college
  const miningStats = await college.calculateGrowthRates();

  // Get geographic distribution of students
  const geographicStats = await User.aggregate([
    {
      $match: {
        college: college._id,
        role: 'student',
        isActive: true
      }
    },
    {
      $group: {
        _id: '$metadata.location.state',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  // Get graduation year distribution
  const graduationStats = await User.aggregate([
    {
      $match: {
        college: college._id,
        role: 'student',
        isActive: true
      }
    },
    {
      $group: {
        _id: '$graduationYear',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.status(200)
    .json(new ApiResponse(
      200,
      {
        basic: college.stats,
        geographic: geographicStats,
        graduation: graduationStats,
        updatedAt: new Date()
      },
      'College stats fetched successfully'
    ))
};

// @desc    Get college activities
// @route   GET /api/colleges/:id/activities
// @access  Public
export const getCollegeActivities = async (req, res) => {
  const { limit = 20 } = req.query;

  const activities = await Activity.getCollegeActivities(
    req.params.id,
    parseInt(limit)
  );

  res.status(200).json(new ApiResponse(
    200,
    activities,
    'College activities fetched successfully'
  ));
};

// @desc    Add new college
// @route   POST /api/colleges
// @access  Private
export const addCollege = async (req, res) => {
  const {
    name,
    shortName,
    city,
    state,
    zipCode,
    country = 'United States',
    type,
    website,
    email
  } = req.body;

  // Check if college already exists
  const existingCollege = await College.findOne({
    name: { $regex: new RegExp('^' + name + '$', 'i') }
  });

  if (existingCollege) {
    throw new ApiError(400, 'College already exists');
  }

  const college = await College.create({
    name,
    shortName,
    address: {
      city,
      state,
      zipCode,
      country
    },
    type,
    website,
    email,
    status: 'pending'
  });

  // Create activity
  await Activity.createActivity({
    type: 'college_added',
    user: req.user._id,
    college: college._id,
    title: 'New college added',
    data: {
      collegeName: name,
      addedBy: req.user.role
    }
  });

  res.status(201).json(new ApiResponse(
    201,
    college,
    'College added successfully and is pending review'
  ));
};
