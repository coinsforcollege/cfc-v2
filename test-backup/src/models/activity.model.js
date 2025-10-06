import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  // Activity Type and Description
  type: {
    type: String,
    enum: [
      'user_registered',
      'user_verified',
      'mining_session',
      'referral_success',
      'college_joined',
      'admin_verified',
      'token_configured',
      'college_added',
      'streak_milestone',
      'leaderboard_position'
    ],
    required: true
  },
  
  // References
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', 
    default: null
  },
  college: {
    type: mongoose.Schema.ObjectId,
    ref: 'College'
  },
  relatedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  // Activity Details
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  // Display Information
  displayText: {
    type: String,
    required: true
  },
  icon: String,
  
  // Data
  data: {
    tokensEarned: Number,
    streakDay: Number,
    ranking: Number,
    previousRanking: Number,
    customData: mongoose.Schema.Types.Mixed
  },
  
  // Visibility and Status
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Geographic Information
  location: {
    country: String,
    state: String,
    city: String
  },
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: String,
    campaign: String
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ college: 1, createdAt: -1 });
activitySchema.index({ isPublic: 1, isActive: 1, createdAt: -1 });

// Virtual for time ago display
activitySchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Static method to create activity
activitySchema.statics.createActivity = async function(activityData) {
  try {
    // Generate display text based on type
    const displayText = this.generateDisplayText(activityData);
    
    const activity = new this({
      ...activityData,
      displayText
    });
    
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

// Static method to generate display text
activitySchema.statics.generateDisplayText = function(data) {
  const { type, user, college, relatedUser } = data;
  
  switch (type) {
    case 'user_registered':
      return `${user?.firstName || 'Someone'} from ${college?.name || 'a college'} just started mining`;
    
    case 'mining_session':
      return `${user?.firstName || 'Someone'} from ${college?.name || 'a college'} just mined ${data.data?.tokensEarned || 0} tokens`;
    
    case 'referral_success':
      return `${user?.firstName || 'Someone'} successfully referred ${relatedUser?.firstName || 'a friend'} to ${college?.name || 'their college'}`;
    
    case 'college_joined':
      return `${college?.name || 'A college'} just joined the waitlist`;
    
    case 'admin_verified':
      return `${college?.name || 'A college'} admin has been verified`;
    
    case 'token_configured':
      return `${college?.name || 'A college'} has configured their token: ${data.data?.tokenName || 'College Token'}`;
    
    case 'streak_milestone':
      return `${user?.firstName || 'Someone'} reached a ${data.data?.streakDay || 0}-day mining streak at ${college?.name || 'their college'}`;
    
    case 'leaderboard_position':
      return `${user?.firstName || 'Someone'} moved up to #${data.data?.ranking || 0} on ${college?.name || 'their college'} leaderboard`;
    
    default:
      return data.title || 'New activity';
  }
};

// Static method to get recent public activities
activitySchema.statics.getRecentPublicActivities = function(limit = 10) {
  return this.find({
    isPublic: true,
    isActive: true
  })
  .populate('user', 'firstName lastName')
  .populate('college', 'name')
  .populate('relatedUser', 'firstName lastName')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get user activities
activitySchema.statics.getUserActivities = function(userId, limit = 20) {
  return this.find({
    user: userId,
    isActive: true
  })
  .populate('college', 'name logo')
  .populate('relatedUser', 'firstName lastName')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get college activities
activitySchema.statics.getCollegeActivities = function(collegeId, limit = 20) {
  return this.find({
    college: collegeId,
    isActive: true
  })
  .populate('user', 'firstName lastName')
  .populate('relatedUser', 'firstName lastName')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get activity statistics
activitySchema.statics.getActivityStats = function(timeframe = 'daily') {
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case 'hourly':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case 'daily':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Method to mark as inactive (soft delete)
activitySchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

export const Activity = mongoose.model('Activity', activitySchema);
