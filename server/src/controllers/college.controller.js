import College from '../models/College.js';

// @desc    Get all colleges (for dropdown/search)
// @route   GET /api/colleges
// @access  Public
export const getAllColleges = async (req, res, next) => {
  try {
    const { search, country, type, status, sortBy = 'tokens', page = 1, limit = 50 } = req.query;

    // Build query - show all colleges (both active and waitlist)
    let query = {};

    // Search by name, country, or city
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by country
    if (country && country !== 'all') {
      query.country = country;
    }

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status; // 'Unaffiliated', 'Waitlist', 'Building', 'Live'
    }

    // Get total count for pagination (before pagination)
    const total = await College.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Determine sort order
    let sortOrder = {};
    if (sortBy === 'miners') {
      sortOrder = { 'stats.totalMiners': -1, name: 1 };
    } else if (sortBy === 'tokens') {
      sortOrder = { 'stats.totalTokensMined': -1, name: 1 };
    } else if (sortBy === 'name') {
      sortOrder = { name: 1 };
    } else {
      sortOrder = { 'stats.totalTokensMined': -1, name: 1 };
    }

    // Execute query
    const colleges = await College.find(query)
      .select('name country city logo coverImage description tagline stats status admin type studentLife')
      .sort(sortOrder)
      .limit(parseInt(limit))
      .skip(skip);

    // Calculate and assign ranks based on totalTokensMined (handle ties)
    const collegesWithRank = [];
    let currentRank = skip + 1;
    let previousTokens = null;
    
    colleges.forEach((college, index) => {
      const collegeObj = college.toObject();
      const tokens = collegeObj.stats?.totalTokensMined || 0;
      
      // If tokens are different from previous, update rank
      if (previousTokens !== null && tokens !== previousTokens) {
        currentRank = skip + index + 1;
      }
      
      collegeObj.rank = currentRank;
      previousTokens = tokens;
      collegesWithRank.push(collegeObj);
    });

    // Get global stats (regardless of filters/pagination)
    const globalStats = await College.aggregate([
      { $match: query }, // Apply same filters as main query
      {
        $group: {
          _id: null,
          totalMiners: { $sum: '$stats.totalMiners' },
          totalTokensMined: { $sum: '$stats.totalTokensMined' }
        }
      }
    ]);

    const stats = globalStats[0] || { totalMiners: 0, totalTokensMined: 0 };

    res.status(200).json({
      colleges: collegesWithRank,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount: total,
        limit: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      globalStats: {
        totalColleges: total,
        totalMiners: stats.totalMiners || 0,
        totalTokensMined: stats.totalTokensMined || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college details
// @route   GET /api/colleges/:id
// @access  Public
export const getCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('createdBy', 'name');

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Calculate rank based on totalTokensMined
    const rank = await College.countDocuments({
      'stats.totalTokensMined': { $gt: college.stats.totalTokensMined }
    });

    const collegeObj = college.toObject();
    collegeObj.rank = rank + 1; // Add 1 because count gives how many are above

    res.status(200).json(collegeObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Search colleges (autocomplete)
// @route   GET /api/colleges/search
// @access  Public
export const searchColleges = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const colleges = await College.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name country logo')
      .limit(10);

    res.status(200).json({
      success: true,
      data: colleges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter metadata (countries, types)
// @route   GET /api/colleges/metadata
// @access  Public
export const getCollegeMetadata = async (req, res, next) => {
  try {
    // Get unique countries and types using MongoDB aggregation
    const countries = await College.distinct('country');
    const types = await College.distinct('type');
    
    res.status(200).json({
      success: true,
      data: {
        countries: countries.filter(Boolean).sort(),
        types: types.filter(Boolean).sort()
      }
    });
  } catch (error) {
    next(error);
  }
};

