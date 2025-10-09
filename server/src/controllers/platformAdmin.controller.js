import User from '../models/User.js';
import College from '../models/College.js';
import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';

// @desc    Get all students
// @route   GET /api/platform-admin/students
// @access  Private (Platform Admin only)
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;

    let query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const students = await User.find(query)
      .populate('college', 'name country')
      .select('name email phone college studentProfile createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new college
// @route   POST /api/platform-admin/colleges
// @access  Private (Platform Admin only)
export const createCollege = async (req, res, next) => {
  try {
    const collegeData = { ...req.body };
    
    // Parse JSON fields if they are strings (from FormData)
    const jsonFields = ['socialMedia', 'departments', 'tokenPreferences', 'campusSize', 'studentLife'];
    jsonFields.forEach(field => {
      if (typeof collegeData[field] === 'string') {
        try {
          collegeData[field] = JSON.parse(collegeData[field]);
        } catch (e) {
          delete collegeData[field];
        }
      }
    });
    
    // Handle file uploads (req.files contains logoFile and/or coverFile)
    if (req.files) {
      if (req.files.logoFile && req.files.logoFile[0]) {
        collegeData.logo = `/images/logo/${req.files.logoFile[0].filename}`;
      }
      if (req.files.coverFile && req.files.coverFile[0]) {
        collegeData.coverImage = `/images/cover/${req.files.coverFile[0].filename}`;
      }
    }
    
    // Remove empty values for logo/coverImage
    if (!collegeData.logo || collegeData.logo === '') {
      delete collegeData.logo;
    }
    if (!collegeData.coverImage || collegeData.coverImage === '') {
      delete collegeData.coverImage;
    }
    
    // Check if college already exists
    const existingCollege = await College.findOne({
      name: { $regex: new RegExp(`^${collegeData.name}$`, 'i') }
    });

    if (existingCollege) {
      return res.status(400).json({
        success: false,
        message: 'College with this name already exists'
      });
    }

    const college = await College.create(collegeData);

    res.status(201).json({
      success: true,
      message: 'College created successfully',
      data: college
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all colleges
// @route   GET /api/platform-admin/colleges
// @access  Private (Platform Admin only)
export const getAllColleges = async (req, res, next) => {
  try {
    const { search, country, page = 1, limit = 50 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    if (country) {
      query.country = country;
    }

    const skip = (page - 1) * limit;

    const colleges = await College.find(query)
      .populate('admin', 'name email')
      .populate('createdBy', 'name email')
      .sort({ 'stats.totalMiners': -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await College.countDocuments(query);

    res.status(200).json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student details
// @route   GET /api/platform-admin/students/:id
// @access  Private (Platform Admin only)
export const getStudentDetails = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('college', 'name country logo')
      .populate('studentProfile.miningColleges.college', 'name country logo stats');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get wallets
    const wallets = await Wallet.find({ student: student._id })
      .populate('college', 'name country');

    // Get mining sessions
    const miningSessions = await MiningSession.find({ student: student._id })
      .populate('college', 'name country')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        student,
        wallets,
        recentMiningSessions: miningSessions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college details
// @route   GET /api/platform-admin/colleges/:id
// @access  Private (Platform Admin only)
export const getCollegeDetails = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('admin', 'name email phone')
      .populate('createdBy', 'name email');

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Get miners count
    const minersCount = await User.countDocuments({
      role: 'student',
      'studentProfile.miningColleges.college': college._id
    });

    // Get active mining sessions
    const activeSessionsCount = await MiningSession.countDocuments({
      college: college._id,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        college,
        minersCount,
        activeSessionsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college details (admin can edit any college)
// @route   PUT /api/platform-admin/colleges/:id
// @access  Private (Platform Admin only)
export const updateCollege = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse JSON fields if they are strings (from FormData)
    const jsonFields = ['socialMedia', 'departments', 'tokenPreferences', 'campusSize', 'studentLife'];
    jsonFields.forEach(field => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          // ignore parse error, leave as is
        }
      }
    });

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;
    delete updateData.createdBy;
    delete updateData.admin;
    delete updateData.stats;
    delete updateData.rank;

    // Handle file uploads (req.files contains logoFile and/or coverFile)
    if (req.files) {
      if (req.files.logoFile && req.files.logoFile[0]) {
        updateData.logo = `/images/logo/${req.files.logoFile[0].filename}`;
      }
      if (req.files.coverFile && req.files.coverFile[0]) {
        updateData.coverImage = `/images/cover/${req.files.coverFile[0].filename}`;
      }
    }
    
    // Remove empty logo/coverImage to preserve existing values
    if (updateData.logo === '' || updateData.logo === null || updateData.logo === undefined) {
      delete updateData.logo;
    }
    if (updateData.coverImage === '' || updateData.coverImage === null || updateData.coverImage === undefined) {
      delete updateData.coverImage;
    }

    const college = await College.findByIdAndUpdate(
      id,
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
      message: 'College updated successfully',
      data: college
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete college
// @route   DELETE /api/platform-admin/colleges/:id
// @access  Private (Platform Admin only)
export const deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if there are active mining sessions
    const activeSessionsCount = await MiningSession.countDocuments({
      college: college._id,
      isActive: true
    });

    if (activeSessionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete college with active mining sessions'
      });
    }

    await college.deleteOne();

    res.status(200).json({
      success: true,
      message: 'College deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics
// @route   GET /api/platform-admin/stats
// @access  Private (Platform Admin only)
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalColleges = await College.countDocuments();
    const totalCollegeAdmins = await User.countDocuments({ role: 'college_admin' });
    const activeMiningSessions = await MiningSession.countDocuments({ isActive: true });

    // Get total tokens mined across all colleges (wallet balance + active mining)
    const wallets = await Wallet.find();
    const walletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    
    // Add tokens from all active mining sessions
    const activeSessions = await MiningSession.find({ isActive: true });
    const now = new Date();
    const activeSessionTokens = activeSessions.reduce((sum, session) => {
      const miningDuration = (now - session.startTime) / (1000 * 60 * 60); // in hours
      const currentTokens = miningDuration * session.earningRate;
      return sum + currentTokens;
    }, 0);
    
    const totalTokensMined = walletBalance + activeSessionTokens;

    // Recent activity
    const recentStudents = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentColleges = await College.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name country createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalColleges,
          totalCollegeAdmins,
          activeMiningSessions,
          totalTokensMined
        },
        recentActivity: {
          recentStudents,
          recentColleges
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

