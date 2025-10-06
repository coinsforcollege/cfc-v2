import mongoose from 'mongoose';

const miningSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  // Earning rate at the time of starting (baseRate + referral bonus)
  earningRate: {
    type: Number,
    required: true
  },
  // Tokens earned in this session (calculated when session ends)
  tokensEarned: {
    type: Number,
    default: 0
  },
  // Last calculated time (for gradual updates)
  lastCalculatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for finding active mining sessions
miningSessionSchema.index({ student: 1, college: 1, isActive: 1 });

const MiningSession = mongoose.model('MiningSession', miningSessionSchema);

export default MiningSession;

