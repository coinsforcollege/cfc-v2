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
    enum: ['student', 'college_admin', 'platform_admin'],
    required: true
  },
  // For students
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
  // Student-specific fields
  studentProfile: {
    miningColleges: [{
      college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      referredStudents: [{
        student: {
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
      sparse: true // Only students have referral codes
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
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for role-based queries
userSchema.index({ role: 1 });

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

// Generate referral code for students
userSchema.pre('save', function(next) {
  if (this.role === 'student' && !this.studentProfile.referralCode) {
    // Generate unique referral code (e.g., STUDENT_ID_TIMESTAMP)
    this.studentProfile.referralCode = `REF${this._id.toString().slice(-8).toUpperCase()}${Date.now().toString().slice(-4)}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

