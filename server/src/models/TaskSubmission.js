import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number // in bytes
  }
}, { _id: false });

const rejectionSchema = new mongoose.Schema({
  rejectedAt: {
    type: Date,
    default: Date.now
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: {
    type: String,
    trim: true
  }
}, { _id: true });

const taskSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    index: true
  },
  files: [fileSchema],
  comment: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  adminFeedback: {
    type: String,
    trim: true
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  rejectionHistory: [rejectionSchema]
}, {
  timestamps: true
});

// Compound index for user+task queries
taskSubmissionSchema.index({ user: 1, task: 1 });
// Index for admin review queue
taskSubmissionSchema.index({ status: 1, createdAt: -1 });

const TaskSubmission = mongoose.model('TaskSubmission', taskSubmissionSchema);

export default TaskSubmission;
