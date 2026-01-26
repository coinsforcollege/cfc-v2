import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'college_admin', 'platform_admin', 'student'],
    required: true
  },
  // For users (miners)
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    default: null
  },
  // For college admins
  managedCollege: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    default: null
  },
  // User-specific fields (for miners)
  userProfile: {
    miningColleges: [{
      college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      referredUsers: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        referredAt: {
          type: Date,
          default: Date.now
        }
      }]
    }],
    referralCode: {
      type: String,
      unique: true,
      sparse: true // Only users have referral codes
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    referredForCollege: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null
    },
    totalReferrals: {
      type: Number,
      default: 0
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    // Colleges the student follows
    followedColleges: [{
      college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
      },
      followedAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Colleges where the student wants to study
    interestedColleges: [{
      college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
      },
      interestedAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Student's country
    country: {
      type: String,
      trim: true,
      default: null
    },
    // Student's grade level
    gradeLevel: {
      type: String,
      enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', null],
      default: null
    },
    // Storage used for documents (in bytes)
    storageUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    // Student's school details
    school: {
      name: {
        type: String,
        trim: true,
        default: null
      },
      address: {
        type: String,
        trim: true,
        default: null
      }
    },
    // Countries where student wants to study
    desiredCollegeCountries: [{
      type: String,
      trim: true
    }],
    // College readiness feature tracking
    collegeReadiness: {
      hasGeneratedChecklist: {
        type: Boolean,
        default: false
      },
      lastChecklistGeneratedAt: {
        type: Date,
        default: null
      },
      activeChecklistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollegeReadinessChecklist',
        default: null
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  languagePreference: {
    type: String,
    enum: ['en', 'zh'],
    default: 'en'
  },
  // Profile picture path (stored in public/images/user-avatar)
  profilePicture: {
    type: String,
    default: null
  },
  // Account deletion request tracking
  accountDeletionRequest: {
    requestedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled', null],
      default: null
    },
    processedAt: {
      type: Date,
      default: null
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reason: {
      type: String,
      default: null
    }
  },
  // Expo push notification tokens (array for multiple devices)
  expoPushTokens: [{
    token: {
      type: String,
      required: true
    },
    deviceId: {
      type: String,
      default: null
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web'],
      default: 'android'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for role-based queries
userSchema.index({ role: 1 });

// Index for mining colleges lookup (critical for WebSocket queries)
userSchema.index({ 'userProfile.miningColleges.college': 1 });

// Index for followed colleges lookup
userSchema.index({ 'userProfile.followedColleges.college': 1 });

// Index for interested colleges lookup
userSchema.index({ 'userProfile.interestedColleges.college': 1 });

// Compound index for active user queries with role filter
userSchema.index({ role: 1, isActive: 1 });

// Index for account deletion requests (for admin queries)
userSchema.index({ 'accountDeletionRequest.status': 1, 'accountDeletionRequest.requestedAt': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code for users (miners)
userSchema.pre('save', function(next) {
  if (this.role === 'user' && !this.userProfile.referralCode) {
    // Generate unique referral code (e.g., USER_ID_TIMESTAMP)
    this.userProfile.referralCode = `REF${this._id.toString().slice(-8).toUpperCase()}${Date.now().toString().slice(-4)}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

