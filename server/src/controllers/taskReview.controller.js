import TaskSubmission from '../models/TaskSubmission.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { sendPushNotification } from '../services/pushNotification.service.js';
import { awardScholarshipPoints } from '../utils/scholarshipPoints.js';

// Get all pending submissions for review
export const getPendingSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'asc' } = req.query;

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const submissions = await TaskSubmission.find({ status: 'pending' })
      .populate('user', 'name email phone')
      .populate('task', 'title thumbnail scholarshipPoints activity categories requiresApproval')
      .populate({
        path: 'task',
        populate: { path: 'categories', select: 'name' }
      })
      .sort(sortObj)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await TaskSubmission.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await TaskSubmission.findById(id)
      .populate('user', 'name email phone')
      .populate('task', 'title description thumbnail scholarshipPoints activity categories requiresApproval files ctaLink ctaLabel')
      .populate({
        path: 'task',
        populate: { path: 'categories', select: 'name' }
      })
      .populate('reviewedBy', 'name email')
      .populate('rejectionHistory.rejectedBy', 'name email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve a submission
export const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const submission = await TaskSubmission.findById(id).populate('task');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This submission has already been reviewed'
      });
    }

    const task = submission.task;
    const pointsToAward = task.scholarshipPoints;

    // Update submission
    submission.status = 'approved';
    submission.reviewedBy = adminId;
    submission.reviewedAt = new Date();
    submission.pointsAwarded = pointsToAward;
    await submission.save();

    // Award points
    if (pointsToAward > 0) {
      // Populate task categories with parent for metadata
      await task.populate({
        path: 'categories',
        select: 'name parent',
        populate: { path: 'parent', select: 'name' }
      });

      // Build category metadata (use first category if multiple)
      const category = task.categories && task.categories[0];
      const metadata = category ? {
        category: category.name,
        categoryId: category._id,
        parentCategory: category.parent?.name || null,
        parentCategoryId: category.parent?._id || null
      } : {};

      await awardScholarshipPoints(
        submission.user,
        pointsToAward,
        'task_approval',
        task._id,
        'Task',
        `Task approved: ${task.title}`,
        metadata
      );
    }

    // Create notification for user
    await Notification.create({
      recipient: submission.user,
      type: 'task_approved',
      title: 'Task Approved!',
      message: `Your submission for "${task.title}" has been approved! You earned ${pointsToAward} scholarship points.`,
      category: 'task',
      priority: 'high',
      data: {
        taskId: task._id,
        submissionId: submission._id,
        points: pointsToAward,
        thumbnail: task.thumbnail || null
      },
      actionUrl: `/tasks/${task._id}`
    });

    // Send push notification
    await sendPushNotification(submission.user, {
      title: 'Task Approved!',
      body: `Your submission for "${task.title}" has been approved! +${pointsToAward} SP`,
      data: {
        type: 'task_approved',
        taskId: task._id.toString(),
        submissionId: submission._id.toString(),
        points: pointsToAward
      }
    });

    res.status(200).json({
      success: true,
      message: 'Submission approved successfully',
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject a submission
export const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const adminId = req.user._id;

    const submission = await TaskSubmission.findById(id).populate('task');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This submission has already been reviewed'
      });
    }

    // Add to rejection history
    submission.rejectionHistory.push({
      rejectedAt: new Date(),
      rejectedBy: adminId,
      feedback: feedback || ''
    });

    // Update submission status
    submission.status = 'rejected';
    submission.reviewedBy = adminId;
    submission.reviewedAt = new Date();
    submission.adminFeedback = feedback || '';
    await submission.save();

    const task = submission.task;

    // Create notification for user
    await Notification.create({
      recipient: submission.user,
      type: 'task_rejected',
      title: 'Task Needs Revision',
      message: feedback
        ? `Your submission for "${task.title}" was not approved. Feedback: ${feedback}`
        : `Your submission for "${task.title}" was not approved. Please try again.`,
      category: 'task',
      priority: 'high',
      data: {
        taskId: task._id,
        submissionId: submission._id,
        feedback: feedback || '',
        thumbnail: task.thumbnail || null
      },
      actionUrl: `/tasks/${task._id}`
    });

    // Send push notification
    await sendPushNotification(submission.user, {
      title: 'Task Needs Revision',
      body: feedback
        ? `Your submission for "${task.title}" needs changes. Check the feedback.`
        : `Your submission for "${task.title}" was not approved. Please try again.`,
      data: {
        type: 'task_rejected',
        taskId: task._id.toString(),
        submissionId: submission._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Submission rejected',
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get review stats
export const getReviewStats = async (req, res) => {
  try {
    const [pending, approvedToday, rejectedToday] = await Promise.all([
      TaskSubmission.countDocuments({ status: 'pending' }),
      TaskSubmission.countDocuments({
        status: 'approved',
        reviewedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      TaskSubmission.countDocuments({
        status: 'rejected',
        reviewedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        pending,
        approvedToday,
        rejectedToday
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
