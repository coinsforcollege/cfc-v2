import ScholarshipWallet from '../models/ScholarshipWallet.js';
import ScholarshipTransaction from '../models/ScholarshipTransaction.js';

/**
 * Award scholarship points to a user
 * @param {ObjectId} userId - The user receiving points
 * @param {number} amount - Points to award
 * @param {string} source - Source of points (task_completion, task_approval, etc.)
 * @param {ObjectId} reference - Reference document ID
 * @param {string} referenceModel - Model name for the reference (Task, TaskSubmission, User)
 * @param {string} description - Human-readable description
 * @param {Object} metadata - Optional metadata with category info
 * @param {string} metadata.category - Category name
 * @param {ObjectId} metadata.categoryId - Category ID
 * @param {string} metadata.parentCategory - Parent category name (if exists)
 * @param {ObjectId} metadata.parentCategoryId - Parent category ID (if exists)
 * @returns {Promise<ScholarshipWallet>} Updated wallet
 */
export const awardScholarshipPoints = async (
  userId,
  amount,
  source,
  reference,
  referenceModel,
  description,
  metadata = {}
) => {
  // Get or create wallet
  let wallet = await ScholarshipWallet.findOne({ user: userId });
  if (!wallet) {
    wallet = new ScholarshipWallet({
      user: userId,
      balance: 0,
      totalEarned: 0,
      totalSpent: 0
    });
  }

  // Update wallet
  wallet.balance += amount;
  wallet.totalEarned += amount;
  await wallet.save();

  // Create transaction record with metadata
  const transaction = new ScholarshipTransaction({
    user: userId,
    type: 'earned',
    amount,
    source,
    reference,
    referenceModel,
    description,
    balanceAfter: wallet.balance,
    metadata
  });
  await transaction.save();

  return wallet;
};
