import ScholarshipWallet from '../models/ScholarshipWallet.js';
import ScholarshipTransaction from '../models/ScholarshipTransaction.js';

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
