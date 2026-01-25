import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true,
    maxlength: [255, 'Document name cannot exceed 255 characters']
  },
  url: {
    type: String,
    required: [true, 'Document URL is required']
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'document', 'other']
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0,
    max: 26214400 // 25MB in bytes
  },
  // Source tracking for where the document came from
  source: {
    type: String,
    enum: ['upload', 'offer', 'task_submission'],
    default: 'upload'
  },
  // Reference ID to the source (e.g., offer ID, task submission ID)
  sourceReference: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  // Model name for the source reference
  sourceModel: {
    type: String,
    enum: ['ScholarshipOffer', 'TaskSubmission', null],
    default: null
  },
  // Visibility toggle - PUBLIC by default, colleges can see public documents
  isPublic: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for user's documents in a folder
documentSchema.index({ user: 1, folder: 1 });

// Index for public documents browsing (by colleges)
documentSchema.index({ user: 1, isPublic: 1 });

// Index for source-based queries
documentSchema.index({ source: 1, sourceReference: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
