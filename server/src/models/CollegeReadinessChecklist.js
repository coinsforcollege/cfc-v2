import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  // Determines UI behavior and required actions
  actionType: {
    type: String,
    enum: ['checkbox', 'file_upload', 'link', 'calculation', 'info'],
    default: 'checkbox'
  },
  // For file_upload type - category of document expected
  linkedDocumentCategory: {
    type: String,
    trim: true,
    default: null
  },
  // Reference to uploaded document
  linkedDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  },
  // For calculation type - scholarship points calculation data
  calculationData: {
    estimatedCost: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'USD'
    },
    currentPoints: {
      type: Number,
      default: null
    },
    targetPoints: {
      type: Number,
      default: null
    },
    weeksRemaining: {
      type: Number,
      default: null
    },
    requiredWeeklyRate: {
      type: Number,
      default: null
    },
    suggestedTier: {
      type: String,
      enum: ['ivy', 'tier1', 'tier2', 'regional', null],
      default: null
    }
  },
  // For link type - external URL
  externalLink: {
    type: String,
    trim: true,
    default: null
  },
  // Completion status
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  // Priority level
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  // Optional deadline (relative, e.g., "6 months before application")
  deadline: {
    type: String,
    trim: true,
    default: null
  },
  // Additional notes from AI or user
  notes: {
    type: String,
    trim: true,
    default: null
  }
}, { _id: false });

const checklistSectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Icon name for frontend display (lucide icon name)
  icon: {
    type: String,
    default: 'CheckSquare'
  },
  // Display order
  order: {
    type: Number,
    default: 0
  },
  items: [checklistItemSchema]
}, { _id: false });

const collegeReadinessChecklistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Form data that generated this checklist
  formData: {
    fieldOfStudy: {
      type: String,
      enum: [
        'Humanities',
        'Science',
        'Business & Finance',
        'Computer Science',
        'Engineering',
        'Medical',
        'Media & Entertainment',
        'Photography & Filmmaking',
        'Arts & Craft',
        'Skill Based Education'
      ],
      required: true
    },
    targetTier: {
      type: String,
      enum: ['ivy', 'tier1', 'tier2', 'regional'],
      required: true
    },
    languagesKnown: [{
      type: String,
      trim: true
    }],
    preferredColleges: [{
      college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        default: null
      },
      manualEntry: {
        type: String,
        trim: true,
        default: null
      }
    }]
  },
  // Snapshot of user profile data at generation time
  profileSnapshot: {
    gradeLevel: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    desiredCollegeCountries: [{
      type: String,
      trim: true
    }]
  },
  // Sections containing checklist items
  sections: [checklistSectionSchema],
  // Overall progress tracking
  progress: {
    totalItems: {
      type: Number,
      default: 0
    },
    completedItems: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  // AI generation metadata
  aiGeneration: {
    prompt: {
      type: String,
      default: null
    },
    model: {
      type: String,
      default: 'gpt-4o'
    },
    generatedAt: {
      type: Date,
      default: null
    },
    tokensUsed: {
      type: Number,
      default: null
    }
  },
  // Version for tracking regenerations
  version: {
    type: Number,
    default: 1
  },
  // Rate limiting - track last generation time
  lastGeneratedAt: {
    type: Date,
    default: null
  },
  // Whether this is the active checklist for the user
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for user's checklists sorted by creation date
collegeReadinessChecklistSchema.index({ user: 1, createdAt: -1 });

// Index for finding active checklist
collegeReadinessChecklistSchema.index({ user: 1, isActive: 1 });

// Method to recalculate progress
collegeReadinessChecklistSchema.methods.recalculateProgress = function() {
  let totalItems = 0;
  let completedItems = 0;

  this.sections.forEach(section => {
    section.items.forEach(item => {
      totalItems++;
      if (item.isCompleted) {
        completedItems++;
      }
    });
  });

  this.progress.totalItems = totalItems;
  this.progress.completedItems = completedItems;
  this.progress.percentage = totalItems > 0
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  return this.progress;
};

// Method to mark an item as completed
collegeReadinessChecklistSchema.methods.completeItem = function(sectionId, itemId) {
  for (const section of this.sections) {
    if (section.sectionId === sectionId) {
      for (const item of section.items) {
        if (item.itemId === itemId) {
          item.isCompleted = true;
          item.completedAt = new Date();
          this.recalculateProgress();
          return item;
        }
      }
    }
  }
  return null;
};

// Method to uncomplete an item
collegeReadinessChecklistSchema.methods.uncompleteItem = function(sectionId, itemId) {
  for (const section of this.sections) {
    if (section.sectionId === sectionId) {
      for (const item of section.items) {
        if (item.itemId === itemId) {
          item.isCompleted = false;
          item.completedAt = null;
          this.recalculateProgress();
          return item;
        }
      }
    }
  }
  return null;
};

// Method to link a document to an item
collegeReadinessChecklistSchema.methods.linkDocument = function(sectionId, itemId, documentId) {
  for (const section of this.sections) {
    if (section.sectionId === sectionId) {
      for (const item of section.items) {
        if (item.itemId === itemId && item.actionType === 'file_upload') {
          item.linkedDocument = documentId;
          item.isCompleted = true;
          item.completedAt = new Date();
          this.recalculateProgress();
          return item;
        }
      }
    }
  }
  return null;
};

// Static method to check if user can regenerate (once per week)
collegeReadinessChecklistSchema.statics.canRegenerate = async function(userId) {
  const latestChecklist = await this.findOne(
    { user: userId },
    { lastGeneratedAt: 1 }
  ).sort({ createdAt: -1 });

  if (!latestChecklist || !latestChecklist.lastGeneratedAt) {
    return { canRegenerate: true };
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (latestChecklist.lastGeneratedAt > oneWeekAgo) {
    const nextAvailable = new Date(latestChecklist.lastGeneratedAt);
    nextAvailable.setDate(nextAvailable.getDate() + 7);
    return {
      canRegenerate: false,
      nextAvailableAt: nextAvailable,
      daysRemaining: Math.ceil((nextAvailable - new Date()) / (1000 * 60 * 60 * 24))
    };
  }

  return { canRegenerate: true };
};

const CollegeReadinessChecklist = mongoose.model('CollegeReadinessChecklist', collegeReadinessChecklistSchema);

export default CollegeReadinessChecklist;
