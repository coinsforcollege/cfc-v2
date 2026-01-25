import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Folder name is required'],
    trim: true,
    maxlength: [100, 'Folder name cannot exceed 100 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
    index: true
  },
  // Full path for breadcrumb navigation (e.g., "/Documents/College Apps")
  path: {
    type: String,
    default: '/'
  }
}, {
  timestamps: true
});

// Compound index for user's folders lookup
folderSchema.index({ user: 1, parent: 1 });

// Compound index for path-based queries
folderSchema.index({ user: 1, path: 1 });

// Prevent duplicate folder names in same parent
folderSchema.index({ user: 1, parent: 1, name: 1 }, { unique: true });

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;
