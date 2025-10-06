import College from '../models/College.js';

// @desc    Get all colleges (for dropdown/search)
// @route   GET /api/colleges
// @access  Public
export const getAllColleges = async (req, res, next) => {
  try {
    const { search, country, page = 1, limit = 50 } = req.query;

    // Build query - show all colleges (both active and waitlist)
    let query = {};

    // Search by name or country
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by country
    if (country) {
      query.country = country;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const colleges = await College.find(query)
      .select('name country city logo coverImage description tagline stats isActive rank')
      .sort({ 'stats.totalMiners': -1, name: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await College.countDocuments(query);

    res.status(200).json(colleges);
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

    res.status(200).json(college);
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

