import mongoose from 'mongoose';
import { User } from './userModels.js';

const collegeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    maxlength: [200, 'College name cannot be more than 200 characters']
  },
  shortName: {
    type: String,
    trim: true,
    maxlength: [50, 'Short name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  // Contact Information
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with http or https'
    ]
  },
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please add a valid phone number']
  },
  
  // Location
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: String,
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },
  
  // Geographic coordinates for map display
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  
  // College Details
  type: {
    type: String,
    enum: ['public', 'private', 'community', 'technical', 'other'],
    required: true
  },
  establishedYear: Number,
  enrollment: {
    total: Number,
    undergraduate: Number,
    graduate: Number
  },
  
  // Visual Assets
  logo: {
    type: String,
    default: 'default-college-logo.png'
  },
  banner: String,
  colors: {
    primary: String,
    secondary: String
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  
  // Admin Information
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  hasVerifiedAdmin: {
    type: Boolean,
    default: false
  },
  adminJoinedDate: Date,
  
  // Token Configuration
  token: {
    name: {
      type: String,
      maxlength: [50, 'Token name cannot be more than 50 characters']
    },
    symbol: {
      type: String,
      uppercase: true,
      maxlength: [10, 'Token symbol cannot be more than 10 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Token description cannot be more than 500 characters']
    },
    maxSupply: {
      type: Number,
      min: [1000, 'Max supply must be at least 1,000']
    },
    icon: String,
    colorScheme: String,
    
    // Use Cases
    earnMethods: [{
      type: String,
      enum: ['daily_login', 'event_attendance', 'academic_achievement', 'community_service', 'referrals', 'custom']
    }],
    spendMethods: [{
      type: String,
      enum: ['dining', 'bookstore', 'events', 'parking', 'merchandise', 'custom']
    }],
    customEarnMethods: [String],
    customSpendMethods: [String],
    
    // Launch Information
    launchTimeline: {
      type: String,
      enum: ['q1_2024', 'q2_2024', 'q3_2024', 'q4_2024', 'q1_2025', 'q2_2025', 'not_sure']
    },
    isConfigured: {
      type: Boolean,
      default: false
    },
    configuredDate: Date
  },
  
  // Statistics
  stats: {
    totalStudents: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
    },
    totalTokensMined: {
      type: Number,
      default: 0
    },
    dailyGrowthRate: {
      type: Number,
      default: 0
    },
    weeklyGrowthRate: {
      type: Number,
      default: 0
    },
    averageMiningStreak: {
      type: Number,
      default: 0
    },
    ranking: Number,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Status and Verification
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'archived'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  // Features and Badges
  badges: [{
    type: String,
    enum: ['hot', 'new', 'growing', 'verified', 'popular', 'rising']
  }],
  
  // Content
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  announcements: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Analytics Data
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
collegeSchema.index({ slug: 1 });
collegeSchema.index({ 'address.state': 1 });
collegeSchema.index({ type: 1 });
collegeSchema.index({ 'stats.totalStudents': -1 });
collegeSchema.index({ 'stats.ranking': 1 });
collegeSchema.index({ location: '2dsphere' });

// Virtual for full address
collegeSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.city}, ${addr.state} ${addr.zipCode || ''}`.trim();
});

// Virtual for admin status display
collegeSchema.virtual('adminStatus').get(function() {
  if (!this.admin) return 'no_admin';
  if (!this.hasVerifiedAdmin) return 'admin_joined';
  if (!this.token.isConfigured) return 'admin_verified';
  return 'token_configured';
});

// Generate slug from name
collegeSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Update badges based on stats
collegeSchema.methods.updateBadges = function() {
  this.badges = [];
  
  // New badge - joined in last 7 days
  if (this.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
    this.badges.push('new');
  }
  
  // Growing badge - 50%+ growth in last week
  if (this.stats.weeklyGrowthRate >= 50) {
    this.badges.push('growing');
  }
  
  // Hot badge - verified admin and configured token
  if (this.hasVerifiedAdmin && this.token.isConfigured) {
    this.badges.push('hot');
  }
  
  // Popular badge - top 20% by student count
  // This would be set by a cron job that calculates percentiles
  
  return this.badges;
};

// Method to calculate growth rates
collegeSchema.methods.calculateGrowthRates = async function() {
  // This would typically involve querying historical data
  // For now, we'll implement basic logic
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const dailyNewStudents = await User.countDocuments({
    college: this._id,
    createdAt: { $gte: oneDayAgo }
  });
  
  const weeklyNewStudents = await User.countDocuments({
    college: this._id,
    createdAt: { $gte: oneWeekAgo }
  });
  
  this.stats.dailyGrowthRate = this.stats.totalStudents > 0 
    ? (dailyNewStudents / this.stats.totalStudents) * 100 
    : 0;
    
  this.stats.weeklyGrowthRate = this.stats.totalStudents > 0 
    ? (weeklyNewStudents / this.stats.totalStudents) * 100 
    : 0;
    
  this.stats.lastUpdated = new Date();
};

export const College = mongoose.model('College', collegeSchema);
