import mongoose from 'mongoose';

const scholarshipTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['earned', 'spent', 'adjustment'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: [
      'task_completion',      // Completed a task
      'task_approval',        // Task approved by admin
      'referral_bonus',       // Referred someone
      'bonus',                // Manual bonus from admin
      'redemption',           // Spent on rewards
      'adjustment',           // Manual adjustment
      'reversal'              // Reversed a previous transaction
    ],
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Task', 'TaskSubmission', 'User', null],
    default: null
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for user transaction history
scholarshipTransactionSchema.index({ user: 1, createdAt: -1 });
// Index for filtering by type/source
scholarshipTransactionSchema.index({ user: 1, type: 1 });
scholarshipTransactionSchema.index({ user: 1, source: 1 });

const ScholarshipTransaction = mongoose.model('ScholarshipTransaction', scholarshipTransactionSchema);

export default ScholarshipTransaction;
