import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create_college',
      'update_college',
      'delete_college',
      'create_admin',
      'update_admin',
      'delete_admin',
      'update_user',
      'delete_user',
      'update_rates',
      'other'
    ]
  },
  targetType: {
    type: String,
    required: true,
    enum: ['College', 'User', 'System']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for searching logs
activityLogSchema.index({ admin: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ targetId: 1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
