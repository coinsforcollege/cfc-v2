import Task from '../models/Task.js';
import TaskCategory from '../models/TaskCategory.js';
import TaskSubmission from '../models/TaskSubmission.js';
import ScholarshipWallet from '../models/ScholarshipWallet.js';
import ScholarshipTransaction from '../models/ScholarshipTransaction.js';
import Notification from '../models/Notification.js';

// Get all active tasks with optional category filter and search
// If user is authenticated (req.user exists), exclude tasks they've already completed
export const getPublicTasks = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    const query = { status: 'Active' };

    // Filter by category if provided (skip if 'all')
    if (category && category !== 'all') {
      query.categories = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If user is authenticated, exclude tasks they've completed or have pending
    if (req.user) {
      const userSubmissions = await TaskSubmission.find({
        user: req.user._id,
        status: { $in: ['pending', 'approved'] }
      }).select('task');

      const completedTaskIds = userSubmissions.map(sub => sub.task);
      if (completedTaskIds.length > 0) {
        query._id = { $nin: completedTaskIds };
      }
    }

    const tasks = await Task.find(query)
      .populate('categories', 'name scholarshipPoints')
      .select('-createdBy')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single task by ID
export const getPublicTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      status: 'Active'
    })
      .populate('categories', 'name scholarshipPoints')
      .select('-createdBy');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all categories sorted by task count (most tasks first)
// Returns "All" pseudo-category first, then top 10 by task count
export const getPublicCategories = async (req, res) => {
  try {
    // Aggregate to get task counts per category (only Active tasks)
    const categoriesWithCounts = await Task.aggregate([
      { $match: { status: 'Active' } },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          taskCount: { $sum: 1 }
        }
      },
      { $sort: { taskCount: -1 } }
    ]);

    // Create a map of category ID to task count
    const countMap = new Map();
    categoriesWithCounts.forEach(item => {
      countMap.set(item._id.toString(), item.taskCount);
    });

    // Get all categories
    const allCategories = await TaskCategory.find().select('name scholarshipPoints');

    // Map categories with their task counts, defaulting to 0
    const categoriesWithTaskCounts = allCategories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      scholarshipPoints: cat.scholarshipPoints,
      taskCount: countMap.get(cat._id.toString()) || 0
    }));

    // Sort by task count (descending) and take top 10
    categoriesWithTaskCounts.sort((a, b) => b.taskCount - a.taskCount);
    const topCategories = categoriesWithTaskCounts.slice(0, 10);

    // Calculate total active tasks for "All" category
    const totalActiveTasks = await Task.countDocuments({ status: 'Active' });

    // Prepend "All" pseudo-category
    const result = [
      {
        _id: 'all',
        name: 'All',
        taskCount: totalActiveTasks
      },
      ...topCategories
    ];

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to award scholarship points
const awardScholarshipPoints = async (userId, amount, source, reference, referenceModel, description) => {
  // Get or create wallet
  let wallet = await ScholarshipWallet.findOne({ user: userId });
  if (!wallet) {
    wallet = new ScholarshipWallet({ user: userId, balance: 0, totalEarned: 0, totalSpent: 0 });
  }

  // Update wallet
  wallet.balance += amount;
  wallet.totalEarned += amount;
  await wallet.save();

  // Create transaction record
  const transaction = new ScholarshipTransaction({
    user: userId,
    type: 'earned',
    amount,
    source,
    reference,
    referenceModel,
    description,
    balanceAfter: wallet.balance
  });
  await transaction.save();

  return wallet;
};

// Submit a task (mark complete or submit for review)
export const submitTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    // Find the task
    const task = await Task.findOne({ _id: taskId, status: 'Active' });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not active'
      });
    }

    // Check for existing pending or approved submission
    const existingSubmission = await TaskSubmission.findOne({
      user: userId,
      task: taskId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingSubmission) {
      if (existingSubmission.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'You have already completed this task'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'You already have a pending submission for this task'
      });
    }

    // Process uploaded files
    const files = req.files ? req.files.map(file => {
      let relativePath = '';
      if (file.mimetype.startsWith('image/')) {
        relativePath = `/images/submissions/${file.filename}`;
      } else if (file.mimetype.startsWith('video/')) {
        relativePath = `/videos/submissions/${file.filename}`;
      } else {
        relativePath = `/documents/submissions/${file.filename}`;
      }
      return {
        url: relativePath,
        type: file.mimetype.startsWith('image/') ? 'image' :
              file.mimetype.startsWith('video/') ? 'video' : 'document',
        name: file.originalname,
        size: file.size
      };
    }) : [];

    // Create submission
    const submission = new TaskSubmission({
      user: userId,
      task: taskId,
      files,
      comment: comment || '',
      status: task.requiresApproval ? 'pending' : 'approved',
      pointsAwarded: task.requiresApproval ? 0 : task.scholarshipPoints
    });

    // If no approval required, award points immediately
    if (!task.requiresApproval && task.scholarshipPoints > 0) {
      await awardScholarshipPoints(
        userId,
        task.scholarshipPoints,
        'task_completion',
        task._id,
        'Task',
        `Completed task: ${task.title}`
      );

      // Create notification for points earned
      await Notification.create({
        recipient: userId,
        type: 'task_points_earned',
        title: 'Points Earned!',
        message: `You earned ${task.scholarshipPoints} scholarship points for completing "${task.title}"`,
        category: 'task',
        data: { taskId: task._id, points: task.scholarshipPoints }
      });
    }

    await submission.save();

    // Populate task info for response
    await submission.populate('task', 'title thumbnail scholarshipPoints');

    res.status(201).json({
      success: true,
      message: task.requiresApproval
        ? 'Submission sent for review'
        : `Task completed! You earned ${task.scholarshipPoints} scholarship points`,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's pending submissions (In Review tab)
export const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const submissions = await TaskSubmission.find({
      user: userId,
      status: 'pending'
    })
      .populate('task', 'title thumbnail scholarshipPoints activity categories requiresApproval')
      .populate({
        path: 'task',
        populate: { path: 'categories', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await TaskSubmission.countDocuments({
      user: userId,
      status: 'pending'
    });

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

// Get user's completed tasks (Completed tab)
export const getMyCompletedTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const submissions = await TaskSubmission.find({
      user: userId,
      status: 'approved'
    })
      .populate('task', 'title thumbnail scholarshipPoints activity categories')
      .populate({
        path: 'task',
        populate: { path: 'categories', select: 'name' }
      })
      .sort({ reviewedAt: -1, createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await TaskSubmission.countDocuments({
      user: userId,
      status: 'approved'
    });

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

// Get task with user's submission status (for task detail page)
export const getTaskWithSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findOne({ _id: id, status: 'Active' })
      .populate('categories', 'name scholarshipPoints');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get user's submission for this task
    const submission = await TaskSubmission.findOne({
      user: userId,
      task: id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...task.toObject(),
        userSubmission: submission
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
