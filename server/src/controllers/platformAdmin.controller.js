import User from '../models/User.js';
import College from '../models/College.js';
import MiningSession from '../models/Mining.js';
import Wallet from '../models/Wallet.js';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { parseAddress } from '../utils/addressParsers.js';
import { createBulkNotifications } from '../services/notification.service.js';
import mongoose from 'mongoose';
import ActivityLog from '../models/ActivityLog.js';

// Helper to log admin activity
const logAdminActivity = async (adminId, action, targetType, targetId, details, req) => {
  try {
    await ActivityLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// @desc    Get all users
// @route   GET /api/platform-admin/users
// @access  Private (Platform Admin only)
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;

    let query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .populate('college', 'name country')
      .select('name email phone college userProfile createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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
          console.warn(`Failed to parse ${field}, removing from create:`, collegeData[field]);
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

    // Log activity
    await logAdminActivity(
      req.user.id,
      'create_college',
      'College',
      college._id,
      { name: college.name, country: college.country },
      req
    );

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

// @desc    Get single user details
// @route   GET /api/platform-admin/users/:id
// @access  Private (Platform Admin only)
export const getStudentDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('college', 'name country logo')
      .populate('userProfile.miningColleges.college', 'name country logo stats');

    if (!user || user.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get wallets
    const wallets = await Wallet.find({ user: user._id })
      .populate('college', 'name country');

    // Get mining sessions
    const miningSessions = await MiningSession.find({ user: user._id })
      .populate('college', 'name country')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        user,
        wallets,
        recentMiningSessions: miningSessions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get college miners (paginated)
// @route   GET /api/platform-admin/colleges/:id/miners
// @access  Private (Platform Admin only)
export const getCollegeMiners = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, search } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Base query: Users who have this college in their miningColleges
    let query = {
      role: 'user',
      'userProfile.miningColleges.college': id
    };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const miners = await User.find(query)
      .select('name email phone createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await User.countDocuments(query);
    
    // Fetch wallet balances for these miners for this college
    const minerIds = miners.map(m => m._id);
    const wallets = await Wallet.find({
      user: { $in: minerIds },
      college: id
    });
    
    // Map wallets to miners
    const minersWithWallet = miners.map(miner => {
      const wallet = wallets.find(w => w.user.toString() === miner._id.toString());
      return {
        ...miner.toObject(),
        wallet: {
          balance: wallet ? wallet.balance : 0,
          totalMined: wallet ? wallet.totalMined : 0
        }
      };
    });
    
    res.status(200).json({
      success: true,
      data: minersWithWallet,
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

// @desc    Get college mining sessions (paginated)
// @route   GET /api/platform-admin/colleges/:id/sessions
// @access  Private (Platform Admin only)
export const getCollegeSessions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, status } = req.query;
    
    const skip = (page - 1) * limit;
    
    let query = { college: id };
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'completed') {
      query.isActive = false;
    }
    
    const sessions = await MiningSession.find(query)
      .populate('user', 'name email')
      .sort({ startTime: -1 }) // Newest first
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await MiningSession.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: sessions,
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
      role: 'user',
      'userProfile.miningColleges.college': college._id
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

    // Get the college before update to track status changes
    const oldCollege = await College.findById(id).select('name status');
    if (!oldCollege) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Parse JSON fields if they are strings (from FormData)
    const jsonFields = ['socialMedia', 'departments', 'tokenPreferences', 'campusSize', 'studentLife'];
    jsonFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (typeof updateData[field] === 'string') {
          try {
            updateData[field] = JSON.parse(updateData[field]);
          } catch (e) {
            // Delete invalid JSON strings instead of corrupting the database
            console.warn(`Failed to parse ${field}, removing from update:`, updateData[field]);
            delete updateData[field];
          }
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

    // Handle explicit deletion of images
    if (updateData.logo === 'DELETE') {
      updateData.logo = '';
    } else if (updateData.logo === '' || updateData.logo === null || updateData.logo === undefined) {
      delete updateData.logo;
    }

    if (updateData.coverImage === 'DELETE') {
      updateData.coverImage = '';
    } else if (updateData.coverImage === '' || updateData.coverImage === null || updateData.coverImage === undefined) {
      delete updateData.coverImage;
    }

    const college = await College.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Check if status changed and notify users
    if (updateData.status && updateData.status !== oldCollege.status) {
      const minersIds = await User.find({
        role: 'user',
        'userProfile.miningColleges.college': college._id
      }).distinct('_id');

      if (minersIds.length > 0) {
        let notificationTitle, notificationMessage, notificationPriority;

        if (updateData.status === 'Live') {
          notificationTitle = `${college.name} is now LIVE!`;
          notificationMessage = `Exciting news! ${college.name} has officially launched. Your tokens are now active and can be used according to the college's token utilities!`;
          notificationPriority = 'high';
        } else if (updateData.status === 'Building') {
          notificationTitle = `${college.name} is building!`;
          notificationMessage = `Great news! ${college.name} has moved to the building phase. Your college token launch is getting closer!`;
          notificationPriority = 'medium';
        } else if (updateData.status === 'Waitlist') {
          notificationTitle = `${college.name} status updated`;
          notificationMessage = `${college.name} has been moved to the waitlist. Keep mining to support your college!`;
          notificationPriority = 'low';
        } else {
          notificationTitle = `${college.name} status updated`;
          notificationMessage = `The status of ${college.name} has been updated to ${updateData.status}.`;
          notificationPriority = 'low';
        }

        const notifications = minersIds.map(userId => ({
          recipient: userId,
          type: 'college_status_changed',
          title: notificationTitle,
          message: notificationMessage,
          data: {
            collegeId: college._id,
            collegeName: college.name,
            newStatus: updateData.status,
            oldStatus: oldCollege.status
          },
          category: 'college',
          priority: notificationPriority,
          actionUrl: '/user/dashboard'
        }));

        await createBulkNotifications(notifications);
      }
    }

    // Log activity
    await logAdminActivity(
      req.user.id,
      'update_college',
      'College',
      college._id,
      { 
        updates: Object.keys(updateData),
        statusChanged: updateData.status && updateData.status !== oldCollege.status,
        oldStatus: oldCollege.status,
        newStatus: updateData.status
      },
      req
    );

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

    // Get all users mining this college before deletion
    const minersIds = await User.find({
      role: 'user',
      'userProfile.miningColleges.college': college._id
    }).distinct('_id');

    console.log(`🗑️ Deleting college: ${college.name}`);
    console.log(`📊 Found ${minersIds.length} miners to clean up`);

    // Stop all active mining sessions for this college
    const activeSessions = await MiningSession.find({
      college: college._id,
      isActive: true
    });

    if (activeSessions.length > 0) {
      console.log(`⛔ Stopping ${activeSessions.length} active mining sessions`);
      await MiningSession.updateMany(
        { college: college._id, isActive: true },
        { isActive: false, endTime: new Date() }
      );
    }

    // Remove college from all users' miningColleges arrays
    if (minersIds.length > 0) {
      console.log(`🧹 Removing college from ${minersIds.length} users' mining lists`);
      await User.updateMany(
        { 'userProfile.miningColleges.college': college._id },
        { $pull: { 'userProfile.miningColleges': { college: college._id } } }
      );
    }

    // Archive wallet data (soft delete - keep balance records for audit)
    const walletCount = await Wallet.countDocuments({ college: college._id });
    if (walletCount > 0) {
      console.log(`💰 Found ${walletCount} wallet records (keeping for audit trail)`);
      // Note: We're NOT deleting wallets to preserve balance history
      // They will be filtered out by frontend as college is null after deletion
    }

    // Notify all affected miners about college deletion
    if (minersIds.length > 0) {
      const notifications = minersIds.map(userId => ({
        recipient: userId,
        type: 'college_deleted',
        title: `${college.name} has been removed`,
        message: `The college "${college.name}" has been removed from the platform. Your mining history and tokens for this college have been preserved in your account records.`,
        data: {
          collegeId: college._id,
          collegeName: college.name
        },
        category: 'college',
        priority: 'high',
        actionUrl: '/user/colleges'
      }));

      await createBulkNotifications(notifications);
      console.log(`📧 Sent deletion notifications to ${minersIds.length} miners`);
    }

    // If college has an admin, set their managedCollege to null
    if (college.admin) {
      await User.findByIdAndUpdate(college.admin, {
        managedCollege: null
      });
      console.log(`👤 Removed admin association`);
    }

    // Finally, delete the college
    await college.deleteOne();
    console.log(`✅ College "${college.name}" deleted successfully`);

    // Log activity
    await logAdminActivity(
      req.user.id,
      'delete_college',
      'College',
      college._id, // Note: This ID will no longer point to an existing college
      { 
        name: college.name,
        minersAffected: minersIds.length,
        walletsPreserved: walletCount 
      },
      req
    );

    res.status(200).json({
      success: true,
      message: 'College deleted successfully',
      data: {
        minersAffected: minersIds.length,
        sessionsEnded: activeSessions.length,
        walletsPreserved: walletCount
      }
    });
  } catch (error) {
    console.error('❌ Error deleting college:', error);
    next(error);
  }
};

// @desc    Update college earning rates
// @route   PUT /api/platform-admin/colleges/:id/rates
// @access  Private (Platform Admin only)
export const updateCollegeRates = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { baseRate, referralBonusRate } = req.body;

    // Validation
    if (baseRate === undefined && referralBonusRate === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide baseRate and/or referralBonusRate'
      });
    }

    if ((baseRate !== undefined && baseRate < 0) || (referralBonusRate !== undefined && referralBonusRate < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Rates cannot be negative'
      });
    }

    const updateData = {};
    if (baseRate !== undefined) updateData.baseRate = baseRate;
    if (referralBonusRate !== undefined) updateData.referralBonusRate = referralBonusRate;

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
      message: 'College rates updated successfully',
      data: {
        id: college._id,
        name: college.name,
        baseRate: college.baseRate,
        referralBonusRate: college.referralBonusRate
      }
    });

    // Log activity
    await logAdminActivity(
      req.user.id,
      'update_rates',
      'College',
      college._id,
      { baseRate, referralBonusRate },
      req
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update default earning rates for all colleges
// @route   PUT /api/platform-admin/default-rates
// @access  Private (Platform Admin only)
export const updateDefaultRates = async (req, res, next) => {
  try {
    const { baseRate, referralBonusRate } = req.body;

    // Validation
    if (baseRate === undefined && referralBonusRate === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide baseRate and/or referralBonusRate'
      });
    }

    if ((baseRate !== undefined && baseRate < 0) || (referralBonusRate !== undefined && referralBonusRate < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Rates cannot be negative'
      });
    }

    const updateData = {};
    if (baseRate !== undefined) updateData.baseRate = baseRate;
    if (referralBonusRate !== undefined) updateData.referralBonusRate = referralBonusRate;

    // Update all colleges
    const result = await College.updateMany({}, updateData);

    res.status(200).json({
      success: true,
      message: `Default rates updated successfully for ${result.modifiedCount} colleges`,
      data: {
        baseRate: baseRate !== undefined ? baseRate : 'unchanged',
        referralBonusRate: referralBonusRate !== undefined ? referralBonusRate : 'unchanged',
        collegesUpdated: result.modifiedCount
      }
    });

    // Log activity
    await logAdminActivity(
      req.user.id,
      'update_rates',
      'System',
      null,
      { 
        baseRate, 
        referralBonusRate,
        collegesUpdated: result.modifiedCount 
      },
      req
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/platform-admin/users/:id
// @access  Private (Platform Admin only)
export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, isActive } = req.body;

    const user = await User.findById(id);

    if (!user || user.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = email;
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already in use'
        });
      }
      user.phone = phone;
    }

    if (name) user.name = name;

    // Update active status if provided
    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

    // Log activity
    await logAdminActivity(
      req.user.id,
      'update_user',
      'User',
      user._id,
      { 
        updates: Object.keys(req.body).filter(k => ['name', 'email', 'phone', 'isActive'].includes(k))
      },
      req
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/platform-admin/users/:id
// @access  Private (Platform Admin only)
export const deleteStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated data
    await Wallet.deleteMany({ user: user._id });
    await MiningSession.deleteMany({ user: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

    // Log activity
    await logAdminActivity(
      req.user.id,
      'delete_user',
      'User',
      user._id, // Will not exist anymore
      { name: user.name, email: user.email },
      req
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password
// @route   PUT /api/platform-admin/users/:id/reset-password
// @access  Private (Platform Admin only)
export const resetStudentPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findById(id);

    if (!user || user.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

    // Log activity
    await logAdminActivity(
      req.user.id,
      'update_user',
      'User',
      user._id,
      { action: 'password_reset' },
      req
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Add balance to user wallet
// @route   POST /api/platform-admin/users/:id/add-balance
// @access  Private (Platform Admin only)
export const addStudentBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { collegeId, amount } = req.body;

    if (!collegeId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid collegeId and amount'
      });
    }

    const user = await User.findById(id);

    if (!user || user.role !== 'user') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const college = await College.findById(collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Find or create wallet
    let wallet = await Wallet.findOne({ user: id, college: collegeId });

    if (!wallet) {
      wallet = await Wallet.create({
        user: id,
        college: collegeId,
        balance: amount
      });
    } else {
      wallet.balance += amount;
      await wallet.save();
    }

    // Update college stats
    await College.findByIdAndUpdate(collegeId, {
      $inc: { 'stats.totalTokensMined': amount }
    });

    await wallet.populate('college', 'name country');

    res.status(200).json({
      success: true,
      message: `Added ${amount} tokens to ${user.name}'s wallet for ${college.name}`,
      data: wallet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all college admins
// @route   GET /api/platform-admin/college-admins
// @access  Private (Platform Admin only)
export const getAllCollegeAdmins = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;

    let query = { role: 'college_admin' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const collegeAdmins = await User.find(query)
      .populate('managedCollege', 'name country logo')
      .select('name email phone managedCollege createdAt lastLogin isActive')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: collegeAdmins,
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

// @desc    Get single college admin details
// @route   GET /api/platform-admin/college-admins/:id
// @access  Private (Platform Admin only)
export const getCollegeAdminDetails = async (req, res, next) => {
  try {
    const collegeAdmin = await User.findById(req.params.id)
      .populate('managedCollege', 'name country logo stats address city state zipCode website type status');

    if (!collegeAdmin || collegeAdmin.role !== 'college_admin') {
      return res.status(404).json({
        success: false,
        message: 'College admin not found'
      });
    }

    // Get additional stats if managing a college
    let collegeStats = {};
    if (collegeAdmin.managedCollege) {
      const minersCount = await User.countDocuments({
        role: 'user',
        'userProfile.miningColleges.college': collegeAdmin.managedCollege._id
      });

      const activeSessionsCount = await MiningSession.countDocuments({
        college: collegeAdmin.managedCollege._id,
        isActive: true
      });

      collegeStats = {
        minersCount,
        activeSessionsCount
      };
    }

    res.status(200).json({
      success: true,
      data: {
        collegeAdmin,
        collegeStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college admin details
// @route   PUT /api/platform-admin/college-admins/:id
// @access  Private (Platform Admin only)
export const updateCollegeAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, managedCollege, isActive } = req.body;

    const collegeAdmin = await User.findById(id);

    if (!collegeAdmin || collegeAdmin.role !== 'college_admin') {
      return res.status(404).json({
        success: false,
        message: 'College admin not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== collegeAdmin.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      collegeAdmin.email = email;
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== collegeAdmin.phone) {
      const existingUser = await User.findOne({ phone, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already in use'
        });
      }
      collegeAdmin.phone = phone;
    }

    if (name) collegeAdmin.name = name;

    // Update managed college if provided
    if (managedCollege !== undefined) {
      if (managedCollege) {
        // Verify college exists
        const college = await College.findById(managedCollege);
        if (!college) {
          return res.status(404).json({
            success: false,
            message: 'College not found'
          });
        }
        collegeAdmin.managedCollege = managedCollege;
      } else {
        collegeAdmin.managedCollege = null;
      }
    }

    // Update active status if provided
    if (isActive !== undefined) {
      collegeAdmin.isActive = isActive;
    }

    await collegeAdmin.save();

    res.status(200).json({
      success: true,
      message: 'College admin updated successfully',
      data: collegeAdmin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete college admin
// @route   DELETE /api/platform-admin/college-admins/:id
// @access  Private (Platform Admin only)
export const deleteCollegeAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const collegeAdmin = await User.findById(req.params.id).session(session);

    if (!collegeAdmin || collegeAdmin.role !== 'college_admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'College admin not found'
      });
    }

    // CRITICAL FIX: Find ALL colleges that have this user as admin
    // This handles cases where user's managedCollege is null but college still references them
    const collegesWithThisAdmin = await College.find({ admin: req.params.id }).session(session);
    
    // Clear admin reference from all colleges that reference this user
    for (const college of collegesWithThisAdmin) {
      college.admin = null;
      // Reset status to Unaffiliated if it was Waitlist or Building
      if (college.status === 'Waitlist' || college.status === 'Building') {
        college.status = 'Unaffiliated';
        console.log(`🔄 College "${college.name}" status reset to Unaffiliated after admin deletion`);
      }
      await college.save({ session });
    }
    
    // Also handle the case where managedCollege exists (for backward compatibility)
    if (collegeAdmin.managedCollege) {
      const wasAlreadyHandled = collegesWithThisAdmin.some(
        c => c._id.toString() === collegeAdmin.managedCollege.toString()
      );
      if (!wasAlreadyHandled) {
      const college = await College.findById(collegeAdmin.managedCollege).session(session);
        if (college && college.admin && college.admin.toString() === req.params.id) {
        college.admin = null;
        if (college.status === 'Waitlist' || college.status === 'Building') {
          college.status = 'Unaffiliated';
          console.log(`🔄 College "${college.name}" status reset to Unaffiliated after admin deletion`);
        }
        await college.save({ session });
        }
      }
    }

    await collegeAdmin.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'College admin deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Reset college admin password
// @route   PUT /api/platform-admin/college-admins/:id/reset-password
// @access  Private (Platform Admin only)
export const resetCollegeAdminPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const collegeAdmin = await User.findById(id);

    if (!collegeAdmin || collegeAdmin.role !== 'college_admin') {
      return res.status(404).json({
        success: false,
        message: 'College admin not found'
      });
    }

    collegeAdmin.password = newPassword;
    await collegeAdmin.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove college admin status from user
// @route   PUT /api/platform-admin/college-admins/:id/remove
// @access  Private (Platform Admin only)
export const removeCollegeAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    
    // Find the college admin
    const collegeAdmin = await User.findById(id).populate('managedCollege', 'name status').session(session);

    if (!collegeAdmin || collegeAdmin.role !== 'college_admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'College admin not found'
      });
    }

    // CRITICAL FIX: Find ALL colleges that have this user as admin
    // This handles cases where user's managedCollege is null but college still references them
    const collegesWithThisAdmin = await College.find({ admin: id }).session(session);
    
    // Get college name for email notification (before we clear it)
    let collegeName = 'Unknown College';
    if (collegeAdmin.managedCollege) {
      collegeName = collegeAdmin.managedCollege.name;
    } else if (collegesWithThisAdmin.length > 0) {
      collegeName = collegesWithThisAdmin[0].name;
    }

    // Update user: change role to 'user' and remove managedCollege
    collegeAdmin.role = 'user';
    const previousManagedCollegeId = collegeAdmin.managedCollege?._id;
    collegeAdmin.managedCollege = null;
    
    // Initialize userProfile if it doesn't exist
    if (!collegeAdmin.userProfile) {
      collegeAdmin.userProfile = {
        miningColleges: [],
        totalReferrals: 0,
        onboardingCompleted: false
      };
    }
    
    // Ensure required userProfile fields exist
    if (!collegeAdmin.userProfile.miningColleges) {
      collegeAdmin.userProfile.miningColleges = [];
    }
    if (collegeAdmin.userProfile.totalReferrals === undefined) {
      collegeAdmin.userProfile.totalReferrals = 0;
    }
    if (collegeAdmin.userProfile.onboardingCompleted === undefined) {
      collegeAdmin.userProfile.onboardingCompleted = false;
    }
    
    await collegeAdmin.save({ session });
    
    console.log('✅ User role changed:', collegeAdmin.role, 'User ID:', collegeAdmin._id);

    // Update ALL colleges that have this user as admin: remove admin reference and reset status if needed
    // This fixes the bug where college.admin wasn't cleared if user's managedCollege was null
    for (const college of collegesWithThisAdmin) {
        college.admin = null;
        // Reset status to Unaffiliated if it was Waitlist or Building
        if (college.status === 'Waitlist' || college.status === 'Building') {
          college.status = 'Unaffiliated';
        }
        await college.save({ session });
        console.log('✅ College admin removed:', college.name, 'New status:', college.status);
    }
    
    // Also handle the case where previousManagedCollegeId exists but wasn't found in collegesWithThisAdmin
    // (for backward compatibility and edge cases)
    if (previousManagedCollegeId) {
      const wasAlreadyHandled = collegesWithThisAdmin.some(
        c => c._id.toString() === previousManagedCollegeId.toString()
      );
      if (!wasAlreadyHandled) {
        const college = await College.findById(previousManagedCollegeId).session(session);
        if (college && college.admin && college.admin.toString() === id) {
          college.admin = null;
          if (college.status === 'Waitlist' || college.status === 'Building') {
            college.status = 'Unaffiliated';
          }
          await college.save({ session });
          console.log('✅ College admin removed (from previousManagedCollege):', college.name, 'New status:', college.status);
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Send email notification
    const { sendCollegeAdminRemovedEmail } = await import('../utils/emailService.js');
    await sendCollegeAdminRemovedEmail(
      collegeAdmin.email,
      collegeAdmin.name,
      collegeName,
      collegeAdmin.languagePreference || 'en'
    );

    res.status(200).json({
      success: true,
      message: 'College admin status removed successfully',
      data: {
        user: collegeAdmin,
        collegeName
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error removing college admin:', error);
    next(error);
  }
};

// @desc    Assign college admin status to user
// @route   PUT /api/platform-admin/users/:id/assign-college-admin
// @access  Private (Platform Admin only)
export const assignCollegeAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { collegeId } = req.body;

    if (!collegeId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'College ID is required'
      });
    }

    // Find the user
    const user = await User.findById(id).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already a college admin
    if (user.role === 'college_admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'User is already a college admin'
      });
    }

    // Find the college
    const college = await College.findById(collegeId).session(session);

    if (!college) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if college already has an admin
    if (college.admin) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This college already has an admin. Only one admin per college is allowed.'
      });
    }

    // Update user: change role to 'college_admin' and set managedCollege
    user.role = 'college_admin';
    user.managedCollege = collegeId;
    await user.save({ session });

    // Update college: set admin reference and update status
    college.admin = user._id;
    // Move to Waitlist if currently Unaffiliated
    if (college.status === 'Unaffiliated') {
      college.status = 'Waitlist';
    }
    await college.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Notify all users mining for this college about status change if status changed
    // Done AFTER transaction commit
    if (college.status === 'Waitlist') {
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
    }

    res.status(200).json({
      success: true,
      message: 'User assigned as college admin successfully',
      data: {
        user,
        college
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Reassign college admin to different college
// @route   PUT /api/platform-admin/college-admins/:id/reassign
// @access  Private (Platform Admin only)
export const reassignCollegeAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { newCollegeId } = req.body;

    if (!newCollegeId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'New college ID is required'
      });
    }

    // Find the admin
    const admin = await User.findById(id).populate('managedCollege').session(session);

    if (!admin || admin.role !== 'college_admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'College admin not found'
      });
    }

    const oldCollege = admin.managedCollege;

    if (!oldCollege) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Admin is not currently managing any college'
      });
    }

    if (oldCollege._id.toString() === newCollegeId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Admin is already managing this college'
      });
    }

    // Find the new college
    const newCollege = await College.findById(newCollegeId).session(session);

    if (!newCollege) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'New college not found'
      });
    }

    // Check if new college already has an admin
    if (newCollege.admin) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'The target college already has an admin'
      });
    }

    console.log(`🔄 Reassigning admin ${admin.name} from ${oldCollege.name} to ${newCollege.name}`);

    // Update old college: remove admin, potentially change status
    // Note: oldCollege is from populate, so we need to fetch it with session to update it
    const oldCollegeDoc = await College.findById(oldCollege._id).session(session);
    oldCollegeDoc.admin = null;
    if (oldCollegeDoc.status === 'Waitlist' || oldCollegeDoc.status === 'Building') {
      oldCollegeDoc.status = 'Unaffiliated';
      console.log(`📊 Old college "${oldCollegeDoc.name}" status changed to Unaffiliated`);
    }
    await oldCollegeDoc.save({ session });

    // Update admin: change managedCollege
    admin.managedCollege = newCollegeId;
    await admin.save({ session });

    // Update new college: set admin, potentially change status
    newCollege.admin = admin._id;
    if (newCollege.status === 'Unaffiliated') {
      newCollege.status = 'Waitlist';
      console.log(`📊 New college "${newCollege.name}" status changed to Waitlist`);
    }
    await newCollege.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Notifications happen after commit
    // Notify miners of old college about admin change
    const oldCollegeMiners = await User.find({
      role: 'user',
      'userProfile.miningColleges.college': oldCollege._id
    }).distinct('_id');

    if (oldCollegeMiners.length > 0) {
      const oldNotifications = oldCollegeMiners.map(userId => ({
        recipient: userId,
        type: 'college_status_changed',
        title: `Admin change for ${oldCollege.name}`,
        message: `The admin for ${oldCollege.name} has been reassigned. The college status has been updated to ${oldCollegeDoc.status}.`,
        data: {
          collegeId: oldCollege._id,
          collegeName: oldCollege.name,
          newStatus: oldCollegeDoc.status
        },
        category: 'college',
        priority: 'medium',
        actionUrl: '/user/colleges'
      }));

      await createBulkNotifications(oldNotifications);
      console.log(`📧 Notified ${oldCollegeMiners.length} miners of old college`);
    }

    // Notify miners of new college about new admin
    const newCollegeMiners = await User.find({
      role: 'user',
      'userProfile.miningColleges.college': newCollege._id
    }).distinct('_id');

    if (newCollegeMiners.length > 0) {
      const newNotifications = newCollegeMiners.map(userId => ({
        recipient: userId,
        type: 'college_status_changed',
        title: `${newCollege.name} has a new admin!`,
        message: `Great news! ${newCollege.name} now has an official admin. ${newCollege.status === 'Waitlist' ? 'The college has been moved to the waitlist and is one step closer to launching its token!' : ''}`,
        data: {
          collegeId: newCollege._id,
          collegeName: newCollege.name,
          newStatus: newCollege.status
        },
        category: 'college',
        priority: 'high',
        actionUrl: '/user/colleges'
      }));

      await createBulkNotifications(newNotifications);
      console.log(`📧 Notified ${newCollegeMiners.length} miners of new college`);
    }

    console.log(`✅ Admin successfully reassigned`);

    res.status(200).json({
      success: true,
      message: 'College admin reassigned successfully',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          previousCollege: {
            id: oldCollege._id,
            name: oldCollege.name,
            newStatus: oldCollegeDoc.status
          },
          newCollege: {
            id: newCollege._id,
            name: newCollege.name,
            newStatus: newCollege.status
          }
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error reassigning college admin:', error);
    next(error);
  }
};


// @desc    Get platform statistics
// @route   GET /api/platform-admin/stats
// @access  Private (Platform Admin only)
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalColleges = await College.countDocuments();
    const totalCollegeAdmins = await User.countDocuments({ role: 'college_admin' });
    const activeMiningSessions = await MiningSession.countDocuments({ isActive: true });

    // Get total tokens mined across all colleges (wallet balance + active mining)
    // Use aggregation to calculate sum in database instead of loading all wallets into memory
    const walletAggregation = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' }
        }
      }
    ]);
    const walletBalance = walletAggregation.length > 0 ? walletAggregation[0].totalBalance : 0;

    // Calculate tokens from active sessions using aggregation
    // Formula: (now - startTime) / (1000 * 60 * 60) * earningRate
    const now = new Date();
    const activeSessionAggregation = await MiningSession.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $project: {
          miningDuration: {
            $divide: [
              { $subtract: [now, '$startTime'] },
              3600000 // milliseconds in an hour
            ]
          },
          earningRate: 1
        }
      },
      {
        $project: {
          currentTokens: { $multiply: ['$miningDuration', '$earningRate'] }
        }
      },
      {
        $group: {
          _id: null,
          totalActiveTokens: { $sum: '$currentTokens' }
        }
      }
    ]);
    const activeSessionTokens = activeSessionAggregation.length > 0 ? activeSessionAggregation[0].totalActiveTokens : 0;

    const totalTokensMined = walletBalance + activeSessionTokens;

    // Recent activity
    const recentUsers = await User.find({ role: 'user' })
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
          totalUsers,
          totalColleges,
          totalCollegeAdmins,
          activeMiningSessions,
          totalTokensMined
        },
        recentActivity: {
          recentUsers,
          recentColleges
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Preview bulk college import from CSV
// @route   POST /api/platform-admin/colleges/bulk-import-preview
// @access  Private (Platform Admin only)
export const bulkImportPreview = async (req, res, next) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file'
      });
    }

    const { country, mode } = req.body;

    // Validate required fields
    if (!country || !mode) {
      return res.status(400).json({
        success: false,
        message: 'Country and import mode are required'
      });
    }

    // Validate mode
    const validModes = ['auto', 'add_only', 'update_only'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid import mode. Must be: auto, add_only, or update_only'
      });
    }

    // Parse CSV file
    const results = [];
    const errors = [];
    const buffer = req.file.buffer;
    const stream = Readable.from(buffer.toString());

    // Process CSV
    await new Promise((resolve, reject) => {
      let rowIndex = 0;
      stream
        .pipe(csv())
        .on('data', (row) => {
          rowIndex++;
          results.push({ ...row, csvRow: rowIndex + 1 }); // +1 for header row
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty or invalid'
      });
    }

    // Process each row
    const toBeCreated = [];
    const toBeUpdated = [];
    const skipped = [];

    for (const row of results) {
      const csvRow = row.csvRow;

      // Validate required field: Name
      if (!row.Name || row.Name.trim() === '') {
        errors.push({
          csvRow,
          data: row,
          reason: 'Missing required field: Name'
        });
        continue;
      }

      // Parse address
      const addressComponents = parseAddress(row.Address, country);

      // Map CSV data to college schema
      const collegeData = {
        name: row.Name.trim(),
        country,
        state: addressComponents.state,
        city: addressComponents.city,
        address: addressComponents.address,
        zipCode: addressComponents.zipCode,
        website: row.Website ? row.Website.trim() : '',
        type: 'University', // Default
        status: 'Unaffiliated',
        baseRate: 0.25,
        referralBonusRate: 0.1,
        stats: {
          totalMiners: 0,
          activeMiners: 0,
          totalTokensMined: 0
        }
      };

      // Parse student population
      if (row['Student population']) {
        const studentPop = parseInt(row['Student population'].replace(/,/g, ''));
        if (!isNaN(studentPop)) {
          collegeData.studentLife = collegeData.studentLife || {};
          collegeData.studentLife.totalStudents = studentPop;
        }
      }

      // Parse campus housing
      if (row['Campus housing']) {
        const housing = row['Campus housing'].trim().toLowerCase();
        collegeData.studentLife = collegeData.studentLife || {};
        collegeData.studentLife.housing = collegeData.studentLife.housing || {};
        collegeData.studentLife.housing.available = housing === 'yes';
      }

      // Warnings array for this row
      const warnings = [];
      if (!addressComponents.city || !addressComponents.state) {
        warnings.push('Address parse failed - stored as-is');
      }

      // Check for duplicates
      const existing = await College.findOne({
        name: { $regex: new RegExp(`^${collegeData.name}$`, 'i') },
        state: collegeData.state || undefined,
        country: country
      });

      if (existing) {
        // College exists
        if (mode === 'add_only') {
          // Skip existing colleges
          skipped.push({
            csvRow,
            name: collegeData.name,
            reason: 'Already exists (Add-only mode)'
          });
        } else {
          // Auto or Update-only mode: prepare update
          const changes = {};
          const noChanges = {};

          // Only update if field is empty in DB
          if (collegeData.website && !existing.website) {
            changes.website = { before: existing.website || '(empty)', after: collegeData.website };
          } else if (existing.website) {
            noChanges.website = { reason: 'Already set', current: existing.website };
          }

          if (collegeData.address && !existing.address) {
            changes.address = { before: existing.address || '(empty)', after: collegeData.address };
          } else if (existing.address) {
            noChanges.address = { reason: 'Already set', current: existing.address };
          }

          if (collegeData.city && !existing.city) {
            changes.city = { before: existing.city || '(empty)', after: collegeData.city };
          } else if (existing.city) {
            noChanges.city = { reason: 'Already set', current: existing.city };
          }

          if (collegeData.state && !existing.state) {
            changes.state = { before: existing.state || '(empty)', after: collegeData.state };
          } else if (existing.state) {
            noChanges.state = { reason: 'Already set', current: existing.state };
          }

          if (collegeData.zipCode && !existing.zipCode) {
            changes.zipCode = { before: existing.zipCode || '(empty)', after: collegeData.zipCode };
          } else if (existing.zipCode) {
            noChanges.zipCode = { reason: 'Already set', current: existing.zipCode };
          }

          if (collegeData.studentLife?.totalStudents && !existing.studentLife?.totalStudents) {
            changes['studentLife.totalStudents'] = {
              before: existing.studentLife?.totalStudents || 0,
              after: collegeData.studentLife.totalStudents
            };
          } else if (existing.studentLife?.totalStudents) {
            noChanges['studentLife.totalStudents'] = {
              reason: 'Already set',
              current: existing.studentLife.totalStudents
            };
          }

          if (collegeData.studentLife?.housing?.available !== undefined &&
              existing.studentLife?.housing?.available === undefined) {
            changes['studentLife.housing.available'] = {
              before: existing.studentLife?.housing?.available || false,
              after: collegeData.studentLife.housing.available
            };
          } else if (existing.studentLife?.housing?.available !== undefined) {
            noChanges['studentLife.housing.available'] = {
              reason: 'Already set',
              current: existing.studentLife.housing.available
            };
          }

          // Protected fields
          noChanges.admin = { reason: 'Protected field', current: existing.admin || 'None' };
          noChanges.stats = { reason: 'Protected field', current: existing.stats };

          // Only add to toBeUpdated if there are actual changes
          if (Object.keys(changes).length > 0) {
            toBeUpdated.push({
              csvRow,
              existingId: existing._id.toString(),
              name: collegeData.name,
              changes,
              noChanges,
              fieldsToUpdate: Object.keys(changes),
              warnings
            });
          } else {
            skipped.push({
              csvRow,
              name: collegeData.name,
              reason: 'No fields to update (all fields already set)'
            });
          }
        }
      } else {
        // College doesn't exist
        if (mode === 'update_only') {
          // Skip new colleges
          skipped.push({
            csvRow,
            name: collegeData.name,
            reason: 'New college (Update-only mode)'
          });
        } else {
          // Auto or Add-only mode: create new
          toBeCreated.push({
            csvRow,
            action: 'CREATE',
            finalState: collegeData,
            warnings
          });
        }
      }
    }

    // Send response
    res.status(200).json({
      success: true,
      country,
      mode,
      summary: {
        totalInCSV: results.length,
        willBeCreated: toBeCreated.length,
        willBeUpdated: toBeUpdated.length,
        willBeSkipped: skipped.length,
        errors: errors.length
      },
      toBeCreated,
      toBeUpdated,
      skipped,
      errors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm bulk college import
// @route   POST /api/platform-admin/colleges/bulk-import-confirm
// @access  Private (Platform Admin only)
export const bulkImportConfirm = async (req, res, next) => {
  try {
    const { country, mode, toBeCreated, toBeUpdated } = req.body;

    // Validate input
    if (!country || !mode) {
      return res.status(400).json({
        success: false,
        message: 'Country and mode are required'
      });
    }

    if (!toBeCreated && !toBeUpdated) {
      return res.status(400).json({
        success: false,
        message: 'No colleges to import'
      });
    }

    const results = {
      created: [],
      updated: [],
      failed: []
    };

    // Create new colleges
    if (toBeCreated && toBeCreated.length > 0) {
      for (const item of toBeCreated) {
        try {
          const college = await College.create(item.finalState);
          results.created.push({
            name: college.name,
            city: college.city,
            state: college.state,
            country: college.country
          });
        } catch (error) {
          results.failed.push({
            csvRow: item.csvRow,
            name: item.finalState.name,
            error: error.message
          });
        }
      }
    }

    // Update existing colleges
    if (toBeUpdated && toBeUpdated.length > 0) {
      for (const item of toBeUpdated) {
        try {
          const updateData = {};

          // Build update object from changes
          for (const [field, change] of Object.entries(item.changes)) {
            updateData[field] = change.after;
          }

          const college = await College.findByIdAndUpdate(
            item.existingId,
            updateData,
            { new: true, runValidators: true }
          );
          results.updated.push({
            name: college.name,
            city: college.city,
            state: college.state,
            country: college.country
          });
        } catch (error) {
          results.failed.push({
            csvRow: item.csvRow,
            name: item.name,
            error: error.message
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Import completed: ${results.created.length} created, ${results.updated.length} updated, ${results.failed.length} failed`,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove all logo and cover images from all colleges
// @route   PUT /api/platform-admin/colleges/bulk-remove-images
// @access  Private (Platform Admin only)
export const bulkRemoveImages = async (req, res, next) => {
  try {
    // Count colleges with logos or cover images before removal
    const collegesWithLogo = await College.countDocuments({
      logo: { $exists: true, $ne: '' }
    });

    const collegesWithCover = await College.countDocuments({
      coverImage: { $exists: true, $ne: '' }
    });

    // Remove all logo and cover images
    const result = await College.updateMany(
      {},
      {
        $set: {
          logo: '',
          coverImage: ''
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'All college images removed successfully',
      data: {
        collegesUpdated: result.modifiedCount,
        collegesWithLogo,
        collegesWithCover
      }
    });
  } catch (error) {
    next(error);
  }
};

