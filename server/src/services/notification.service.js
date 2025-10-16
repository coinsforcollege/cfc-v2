import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import { broadcastNotification, broadcastNotificationBulk } from '../websocket/miningSocket.js';

// Milestone arrays - defining all milestones
const TOKEN_MILESTONES = [
  100, 500, 1000, 5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000,
  75000, 100000, 150000, 200000, 250000, 500000, 1000000
];

const MINER_MILESTONES = [
  10, 20, 50, 100, 250, 500, 1000, 2000, 5000, 10000, 15000, 20000, 50000
];

const ADMIN_TOKEN_MILESTONES = [
  10000, 50000, 100000, 250000, 500000, 750000, 1000000, 2500000, 5000000, 10000000
];

/**
 * Create a notification for a user
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Notification>}
 */
export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);

    // Broadcast notification via WebSocket if user is connected
    broadcastNotification(notification.recipient, notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create multiple notifications in bulk
 * @param {Array} notificationsArray - Array of notification data objects
 * @returns {Promise<Array>}
 */
export const createBulkNotifications = async (notificationsArray) => {
  try {
    const notifications = await Notification.insertMany(notificationsArray);

    // Broadcast notifications via WebSocket if users are connected
    broadcastNotificationBulk(notifications);

    return notifications;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

/**
 * Check if student reached a token milestone
 * @param {String} studentId - Student ID
 * @param {String} collegeId - College ID
 * @param {Number} newBalance - New wallet balance
 * @returns {Promise<Number|null>} - Milestone reached or null
 */
export const checkTokenMilestone = async (studentId, collegeId, newBalance) => {
  try {
    // Get previous balance from wallet
    const wallet = await Wallet.findOne({ student: studentId, college: collegeId });
    const previousBalance = wallet ? wallet.balance - newBalance : 0;

    // Find milestone crossed
    for (const milestone of TOKEN_MILESTONES) {
      if (previousBalance < milestone && newBalance >= milestone) {
        return milestone;
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking token milestone:', error);
    return null;
  }
};

/**
 * Check if college reached a miner milestone
 * @param {String} collegeId - College ID
 * @param {Number} newMinerCount - New miner count
 * @param {Number} previousMinerCount - Previous miner count
 * @returns {Number|null} - Milestone reached or null
 */
export const checkMinerMilestone = (newMinerCount, previousMinerCount) => {
  for (const milestone of MINER_MILESTONES) {
    if (previousMinerCount < milestone && newMinerCount >= milestone) {
      return milestone;
    }
  }
  return null;
};

/**
 * Check if college reached an admin token milestone
 * @param {Number} newTokenCount - New total tokens mined
 * @param {Number} previousTokenCount - Previous total tokens mined
 * @returns {Number|null} - Milestone reached or null
 */
export const checkAdminTokenMilestone = (newTokenCount, previousTokenCount) => {
  for (const milestone of ADMIN_TOKEN_MILESTONES) {
    if (previousTokenCount < milestone && newTokenCount >= milestone) {
      return milestone;
    }
  }
  return null;
};

/**
 * Notify all students mining a college about a miner milestone
 * @param {String} collegeId - College ID
 * @param {String} collegeName - College name
 * @param {Number} milestone - Miner count milestone
 */
export const notifyStudentsAboutMinerMilestone = async (collegeId, collegeName, milestone) => {
  try {
    // Get all students mining this college
    const students = await User.find({
      role: 'student',
      'studentProfile.miningColleges.college': collegeId
    }).select('_id');

    if (students.length === 0) return;

    // Create notifications for all students
    const notifications = students.map(student => ({
      recipient: student._id,
      type: 'college_miner_milestone',
      title: `${collegeName} reached ${milestone.toLocaleString()} miners!`,
      message: `Your college ${collegeName} now has ${milestone.toLocaleString()} community members mining. The community is growing!`,
      data: {
        collegeId,
        collegeName,
        milestone
      },
      isRead: false,
      category: 'milestone',
      priority: 'medium',
      actionUrl: `/student/colleges`
    }));

    await createBulkNotifications(notifications);

    console.log(`Created miner milestone notifications for ${students.length} students`);
  } catch (error) {
    console.error('Error notifying students about miner milestone:', error);
  }
};

/**
 * Notify college admin about token milestone
 * @param {String} adminId - Admin ID
 * @param {String} collegeName - College name
 * @param {Number} milestone - Token milestone
 */
export const notifyAdminAboutTokenMilestone = async (adminId, collegeName, milestone) => {
  try {
    await createNotification({
      recipient: adminId,
      type: 'token_milestone_admin',
      title: `${milestone.toLocaleString()} tokens mined!`,
      message: `Congratulations! Your college ${collegeName} has reached ${milestone.toLocaleString()} tokens mined in total.`,
      data: {
        milestone
      },
      isRead: false,
      category: 'milestone',
      priority: 'high',
      actionUrl: `/college-admin/dashboard`
    });

    console.log(`Created token milestone notification for admin ${adminId}`);
  } catch (error) {
    console.error('Error notifying admin about token milestone:', error);
  }
};

/**
 * Notify college admin about miner milestone
 * @param {String} adminId - Admin ID
 * @param {String} collegeName - College name
 * @param {Number} milestone - Miner milestone
 */
export const notifyAdminAboutMinerMilestone = async (adminId, collegeName, milestone) => {
  try {
    await createNotification({
      recipient: adminId,
      type: 'miner_milestone',
      title: `${milestone.toLocaleString()} miners reached!`,
      message: `Amazing growth! Your college ${collegeName} now has ${milestone.toLocaleString()} community members mining.`,
      data: {
        milestone
      },
      isRead: false,
      category: 'milestone',
      priority: 'high',
      actionUrl: `/college-admin/community`
    });

    console.log(`Created miner milestone notification for admin ${adminId}`);
  } catch (error) {
    console.error('Error notifying admin about miner milestone:', error);
  }
};

/**
 * Delete notifications older than specified days
 * @param {Number} days - Number of days (default: 30)
 */
export const cleanupOldNotifications = async (days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true
    });

    console.log(`Deleted ${result.deletedCount} old notifications`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
    throw error;
  }
};

/**
 * Check for duplicate notification in recent time
 * @param {String} recipientId - Recipient user ID
 * @param {String} type - Notification type
 * @param {Object} data - Notification data to match
 * @param {Number} minutesWindow - Time window in minutes (default: 5)
 * @returns {Promise<Boolean>} - True if duplicate exists
 */
export const isDuplicateNotification = async (recipientId, type, data, minutesWindow = 5) => {
  try {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - minutesWindow);

    const duplicate = await Notification.findOne({
      recipient: recipientId,
      type,
      'data.collegeId': data.collegeId,
      createdAt: { $gte: cutoffTime }
    });

    return !!duplicate;
  } catch (error) {
    console.error('Error checking duplicate notification:', error);
    return false;
  }
};
