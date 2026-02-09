import mongoose from 'mongoose';

const walletSnapshotSchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  totalMined: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const migrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bridgeLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BridgeLink',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  walletSnapshots: [walletSnapshotSchema],
  totalTokensMigrated: {
    type: Number,
    default: 0,
    min: 0
  },
  exchangeTransactionId: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  },
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Migration = mongoose.model('Migration', migrationSchema);

export default Migration;
