import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'college_admin', 'password_change', 'forgot_password'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
otpVerificationSchema.index({ email: 1, role: 1 });

// Method to check if OTP is expired
otpVerificationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to increment attempts
otpVerificationSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  this.lastAttemptAt = new Date();
  return this.save();
};

const OTPVerification = mongoose.model('OTPVerification', otpVerificationSchema);

export default OTPVerification;
