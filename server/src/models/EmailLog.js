import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  emailType: {
    type: String,
    required: true,
    enum: [
      'welcome',
      'otp_verification',
      'miner_stopped',
      'inactivity_12h',
      'inactivity_3d',
      'inactivity_1w',
      'inactivity_weekly'
    ],
    index: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  error: {
    type: String
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for checking duplicate emails
emailLogSchema.index({ recipient: 1, emailType: 1, createdAt: -1 });

// Index for cleanup queries
emailLogSchema.index({ createdAt: 1 });

// Method to check if email was recently sent (within specified hours)
emailLogSchema.statics.wasRecentlySent = async function(userId, emailType, withinHours = 24) {
  const cutoffTime = new Date(Date.now() - withinHours * 60 * 60 * 1000);

  const recentEmail = await this.findOne({
    recipient: userId,
    emailType,
    status: 'sent',
    sentAt: { $gte: cutoffTime }
  });

  return !!recentEmail;
};

// Method to log email attempt
emailLogSchema.statics.logEmail = async function(userId, email, emailType, metadata = {}) {
  return await this.create({
    recipient: userId,
    email,
    emailType,
    status: 'pending',
    metadata
  });
};

// Method to mark email as sent
emailLogSchema.methods.markAsSent = async function() {
  this.status = 'sent';
  this.sentAt = new Date();
  return await this.save();
};

// Method to mark email as failed
emailLogSchema.methods.markAsFailed = async function(error) {
  this.status = 'failed';
  this.error = error;
  return await this.save();
};

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
