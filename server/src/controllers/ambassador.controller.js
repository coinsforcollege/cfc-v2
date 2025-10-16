import AmbassadorApplication from '../models/AmbassadorApplication.js';
import User from '../models/User.js';
import { createNotification } from '../services/notification.service.js';

// @desc    Submit ambassador application
// @route   POST /api/ambassador/apply
// @access  Private (Student only)
export const submitApplication = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const {
      name,
      email,
      phone,
      yearOfStudy,
      major,
      leadershipExperience,
      campusInvolvement,
      whyAmbassador,
      socialMediaHandles,
      availability,
      referredBy,
      additionalComments
    } = req.body;

    // Get student's college
    const student = await User.findById(studentId);
    if (!student.college) {
      return res.status(400).json({
        success: false,
        message: 'You must be associated with a college to apply'
      });
    }

    // Check if student already has a pending or approved application
    const existingApplication = await AmbassadorApplication.findOne({
      student: studentId,
      status: { $in: ['pending', 'under_review', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active application'
      });
    }

    // Create new application
    const application = await AmbassadorApplication.create({
      student: studentId,
      name,
      email,
      phone,
      college: student.college,
      yearOfStudy,
      major,
      leadershipExperience,
      campusInvolvement,
      whyAmbassador,
      socialMediaHandles,
      availability,
      referredBy,
      additionalComments
    });

    await application.populate('college', 'name country');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's own application
// @route   GET /api/ambassador/my-application
// @access  Private (Student only)
export const getMyApplication = async (req, res, next) => {
  try {
    const application = await AmbassadorApplication.findOne({ student: req.user.id })
      .populate('college', 'name country logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Platform Admin only)
// @route   GET /api/ambassador/applications
// @access  Private (Platform Admin only)
export const getAllApplications = async (req, res, next) => {
  try {
    const { status, college, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (college) query.college = college;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get applications
    const applications = await AmbassadorApplication.find(query)
      .populate('student', 'name email')
      .populate('college', 'name country logo')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await AmbassadorApplication.countDocuments(query);

    // Get stats
    const stats = await AmbassadorApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statsObject = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statsObject[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        },
        stats: statsObject
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/ambassador/applications/:id
// @access  Private (Platform Admin only)
export const getApplication = async (req, res, next) => {
  try {
    const application = await AmbassadorApplication.findById(req.params.id)
      .populate('student', 'name email phone')
      .populate('college', 'name country logo')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/ambassador/applications/:id/status
// @access  Private (Platform Admin only)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    const application = await AmbassadorApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      },
      { new: true, runValidators: true }
    ).populate('student', 'name email')
     .populate('college', 'name country');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Notify student about application status change
    let notificationTitle, notificationMessage, notificationType, notificationPriority;

    if (status === 'approved') {
      notificationTitle = 'Ambassador application approved!';
      notificationMessage = `Congratulations! Your ambassador application for ${application.college.name} has been approved. Welcome to the ambassador program!`;
      notificationType = 'ambassador_approved';
      notificationPriority = 'high';
    } else if (status === 'rejected') {
      notificationTitle = 'Ambassador application update';
      notificationMessage = `Your ambassador application for ${application.college.name} has been reviewed. ${reviewNotes || 'Please check the application details for more information.'}`;
      notificationType = 'ambassador_rejected';
      notificationPriority = 'medium';
    } else if (status === 'under_review') {
      notificationTitle = 'Ambassador application under review';
      notificationMessage = `Your ambassador application for ${application.college.name} is now under review. We'll notify you once a decision has been made.`;
      notificationType = 'ambassador_under_review';
      notificationPriority = 'low';
    }

    if (notificationTitle) {
      await createNotification({
        recipient: application.student._id,
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        data: {
          applicationId: application._id,
          collegeId: application.college._id,
          collegeName: application.college.name,
          status: status,
          reviewNotes: reviewNotes
        },
        category: 'ambassador',
        priority: notificationPriority,
        actionUrl: '/student/ambassador/application'
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

