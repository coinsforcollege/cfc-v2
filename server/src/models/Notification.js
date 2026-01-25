import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      // Student notifications
      'mining_completed',
      'mining_expiring_soon',
      'token_milestone',
      'college_rate_changed',
      'referral_signup',
      'referral_started_mining',
      'referral_bonus_earned',
      'college_got_admin',
      'college_status_changed',
      'college_miner_milestone',
      'ambassador_status_changed',

      // Task notifications (student)
      'task_approved',
      'task_rejected',
      'task_points_earned',

      // Scholarship offer notifications (student)
      'scholarship_offer_received',
      'scholarship_offer_expiring',

      // Scholarship offer notifications (college admin)
      'scholarship_offer_accepted',
      'scholarship_offer_rejected',

      // College Admin notifications
      'new_miner_joined',
      'miner_milestone',
      'token_milestone_admin',
      'leaderboard_rank_improved',
      'active_miners_spike',
      'new_ambassador_application',
      'profile_incomplete_reminder',
      'token_preferences_reminder'
    ],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  category: {
    type: String,
    enum: ['mining', 'referral', 'college', 'milestone', 'ambassador', 'system', 'task', 'scholarship'],
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, category: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });

// Index for cleanup queries (auto-delete old notifications)
notificationSchema.index({ createdAt: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
