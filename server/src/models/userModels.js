import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please add a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  
  // Role
  role: {
    type: String,
    enum: ['student', 'college_admin', 'platform_admin'],
    required: true
  },
  
  // Verification Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  phoneVerificationToken: String,
  
  // Student-specific fields
  college: {
    type: mongoose.Schema.ObjectId,
    ref: 'College'
  },
  graduationYear: {
    type: Number,
    min: 2024,
    max: 2030
  },
  
  // College Admin specific fields
  position: {
    type: String,
    maxlength: [100, 'Position cannot be more than 100 characters']
  },
  workPhone: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please add a valid work phone number']
  },
  workEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid work email']
  },
  department: {
    type: String,
    maxlength: [100, 'Department cannot be more than 100 characters']
  },
  isAdminVerified: {
    type: Boolean,
    default: false
  },
  adminVerificationDate: Date,
  adminVerificationSubmittedAt: Date,
  adminVerificationDocuments: [String],
  
  // Mining Data
  totalTokensMined: {
    type: Number,
    default: 0
  },
  lastMiningDate: Date,
  miningStreak: {
    type: Number,
    default: 0
  },
  canMineAt: Date,
  
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralTokensEarned: {
    type: Number,
    default: 0
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  
  // Notification Preferences
  notifications: {
    miningReminders: {
      type: Boolean,
      default: true
    },
    referralUpdates: {
      type: Boolean,
      default: true
    },
    collegeUpdates: {
      type: Boolean,
      default: true
    },
    weeklySummary: {
      type: Boolean,
      default: true
    }
  },
  
  // Security
  passwordResetToken: String,
  passwordResetExpire: Date,
  twoFactorSecret: String,
  isTwoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  // Activity Tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  ipAddress: String,
  userAgent: String,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ college: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name (for leaderboards)
userSchema.virtual('displayName').get(function() {
  return `${this.firstName} ${this.lastName.charAt(0)}.`;
});

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  this.referralCode = result;
  return result;
};

// Check if user can mine
userSchema.methods.canMine = function() {
  if (!this.canMineAt) return true;
  return new Date() >= this.canMineAt;
};

// Set next mining time
userSchema.methods.setNextMiningTime = function() {
  const hours = parseInt(process.env.MINING_INTERVAL_HOURS) || 24;
  this.canMineAt = new Date(Date.now() + (hours * 60 * 60 * 1000));
};

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate referral code on save if student and doesn't have one
userSchema.pre('save', function(next) {
  if (this.role === 'student' && !this.referralCode) {
    this.generateReferralCode();
  }
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model('User', userSchema);
