import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  scholarshipPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskCategory',
    default: null
  }
}, {
  timestamps: true
});

// Virtual for children
categorySchema.virtual('children', {
  ref: 'TaskCategory',
  localField: '_id',
  foreignField: 'parent'
});

// Ensure virtuals are included in JSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const TaskCategory = mongoose.model('TaskCategory', categorySchema);

export default TaskCategory;
