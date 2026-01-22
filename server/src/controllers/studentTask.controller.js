import Task from '../models/Task.js';
import TaskCategory from '../models/TaskCategory.js';

// Get all active tasks with optional category filter and search
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
