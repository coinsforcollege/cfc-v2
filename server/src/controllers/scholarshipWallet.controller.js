import ScholarshipWallet from '../models/ScholarshipWallet.js';
import ScholarshipTransaction from '../models/ScholarshipTransaction.js';
import User from '../models/User.js';

// Get user's scholarship wallet
export const getMyWallet = async (req, res) => {
  try {
    const userId = req.user._id;

    let wallet = await ScholarshipWallet.findOne({ user: userId });

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await ScholarshipWallet.create({
        user: userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's transaction history
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type, source } = req.query;

    const query = { user: userId };
    if (type) query.type = type;
    if (source) query.source = source;

    const transactions = await ScholarshipTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await ScholarshipTransaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
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

// Get scholarship analytics (for trajectory chart and category breakdown)
export const getScholarshipAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's account creation date
    const user = await User.findById(userId).select('createdAt');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get or create wallet
    let wallet = await ScholarshipWallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await ScholarshipWallet.create({
        user: userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0
      });
    }

    const accountCreatedAt = user.createdAt;
    const now = new Date();
    const daysSinceCreation = Math.ceil((now - accountCreatedAt) / (1000 * 60 * 60 * 24));

    // Build chart data with smart aggregation
    // Last 30 days: daily, 31-90 days: weekly, 90+ days: monthly
    const chartData = await buildChartData(userId, accountCreatedAt, now, daysSinceCreation);

    // Get category breakdown from transactions
    const categoryBreakdown = await ScholarshipTransaction.aggregate([
      { $match: { user: userId, type: 'earned' } },
      {
        $group: {
          _id: '$metadata.category',
          totalPoints: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    // Format category breakdown
    const formattedCategories = categoryBreakdown.map(cat => ({
      category: cat._id || 'Uncategorized',
      totalPoints: cat.totalPoints,
      transactionCount: cat.transactionCount
    }));

    res.status(200).json({
      success: true,
      data: {
        accountCreatedAt,
        currentBalance: wallet.balance,
        totalEarned: wallet.totalEarned,
        chartData,
        categoryBreakdown: formattedCategories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to build chart data with smart aggregation
async function buildChartData(userId, startDate, endDate, daysSinceCreation) {
  const chartData = [];

  // Start with 0 balance at account creation
  chartData.push({
    date: startDate.toISOString().split('T')[0],
    balance: 0
  });

  // If no transactions yet, return just the starting point
  const transactionCount = await ScholarshipTransaction.countDocuments({ user: userId });
  if (transactionCount === 0) {
    return chartData;
  }

  // Determine aggregation strategy based on time span
  if (daysSinceCreation <= 30) {
    // Daily aggregation for last 30 days
    const dailyData = await aggregateByPeriod(userId, startDate, endDate, 'day');
    chartData.push(...dailyData);
  } else if (daysSinceCreation <= 90) {
    // Weekly aggregation for 31-90 days
    const weeklyData = await aggregateByPeriod(userId, startDate, endDate, 'week');
    chartData.push(...weeklyData);
  } else {
    // Mixed aggregation for 90+ days
    // Monthly for older data, weekly for last 90 days, daily for last 30 days
    const ninetyDaysAgo = new Date(endDate);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const thirtyDaysAgo = new Date(endDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Monthly aggregation for data older than 90 days
    if (startDate < ninetyDaysAgo) {
      const monthlyData = await aggregateByPeriod(userId, startDate, ninetyDaysAgo, 'month');
      chartData.push(...monthlyData);
    }

    // Weekly aggregation for 31-90 days ago
    if (ninetyDaysAgo < thirtyDaysAgo) {
      const weeklyData = await aggregateByPeriod(userId, ninetyDaysAgo, thirtyDaysAgo, 'week');
      chartData.push(...weeklyData);
    }

    // Daily aggregation for last 30 days
    const dailyData = await aggregateByPeriod(userId, thirtyDaysAgo, endDate, 'day');
    chartData.push(...dailyData);
  }

  // Sort by date and calculate running balance
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate cumulative balance
  let runningBalance = 0;
  for (let i = 0; i < chartData.length; i++) {
    if (chartData[i].earned !== undefined) {
      runningBalance += chartData[i].earned;
      chartData[i].balance = runningBalance;
      delete chartData[i].earned;
    }
  }

  return chartData;
}

// Helper to aggregate transactions by period (day, week, month)
async function aggregateByPeriod(userId, startDate, endDate, period) {
  let dateFormat;
  switch (period) {
    case 'day':
      dateFormat = '%Y-%m-%d';
      break;
    case 'week':
      dateFormat = '%Y-W%V'; // ISO week
      break;
    case 'month':
      dateFormat = '%Y-%m';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }

  const aggregation = await ScholarshipTransaction.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        earned: { $sum: { $cond: [{ $eq: ['$type', 'earned'] }, '$amount', 0] } },
        spent: { $sum: { $cond: [{ $eq: ['$type', 'spent'] }, '$amount', 0] } },
        lastDate: { $max: '$createdAt' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return aggregation.map(item => ({
    date: item.lastDate.toISOString().split('T')[0],
    earned: item.earned - item.spent // Net change
  }));
}
