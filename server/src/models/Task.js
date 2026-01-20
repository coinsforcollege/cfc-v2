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
  }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskCategory',
    required: [true, 'At least one category is required']
  }],
  topic: [String], // Array of custom topics
  grade: [{
    type: String,
    // "Kindergarten", "1", ... "12"
    required: true
  }],
  difficulty: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  activity: {
    type: String,
    enum: ['MCQ Quiz', 'Learn', 'Submission', 'Script'],
    default: 'Learn'
  },
  scholarshipPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  ctaLink: {
    type: String,
    trim: true
  },
  ctaLabel: {
    type: String,
    trim: true
  },
  files: [fileSchema],
  thumbnail: {
    type: String // URL
  },
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Draft'],
    default: 'Draft'
  },
  expiryDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for faster querying
taskSchema.index({ status: 1 });
taskSchema.index({ categories: 1 });
taskSchema.index({ grade: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
