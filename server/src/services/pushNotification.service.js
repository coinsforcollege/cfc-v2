import User from '../models/User.js';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Send push notification to a user
 * @param {string} userId - User ID to send notification to
 * @param {object} notification - Notification data
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body/message
 * @param {object} notification.data - Additional data to send with notification
 */
export const sendPushNotification = async (userId, { title, body, data = {} }) => {
  try {
    console.log(`[PUSH] Sending push notification to user ${userId}`);
    console.log(`[PUSH] Title: ${title}, Body: ${body}`);

    const user = await User.findById(userId).select('expoPushTokens');

    if (!user || !user.expoPushTokens || user.expoPushTokens.length === 0) {
      console.log(`[PUSH] No push tokens found for user ${userId}`);
      return { success: false, message: 'No push tokens found' };
    }

    console.log(`[PUSH] Found ${user.expoPushTokens.length} token(s) for user`);

    // Build messages for all user's devices
    const messages = user.expoPushTokens.map(tokenObj => ({
      to: tokenObj.token,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default',
    }));

    // Send to Expo Push API
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log(`[PUSH] Expo API response:`, JSON.stringify(result, null, 2));

    // Check for errors and handle invalid tokens
    if (result.data) {
      const invalidTokens = [];
      result.data.forEach((item, index) => {
        if (item.status === 'error') {
          if (item.details?.error === 'DeviceNotRegistered') {
            invalidTokens.push(user.expoPushTokens[index].token);
          }
          console.error(`Push notification error for token ${index}:`, item.message);
        }
      });

      // Remove invalid tokens from user
      if (invalidTokens.length > 0) {
        await User.findByIdAndUpdate(userId, {
          $pull: { expoPushTokens: { token: { $in: invalidTokens } } }
        });
        console.log(`Removed ${invalidTokens.length} invalid tokens for user ${userId}`);
      }
    }

    return { success: true, result };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to multiple users
 * @param {string[]} userIds - Array of user IDs
 * @param {object} notification - Notification data
 */
export const sendPushNotificationToMany = async (userIds, notification) => {
  const results = await Promise.allSettled(
    userIds.map(userId => sendPushNotification(userId, notification))
  );
  return results;
};

/**
 * Register a push token for a user
 * @param {string} userId - User ID
 * @param {string} token - Expo push token
 * @param {string} platform - Device platform (ios, android, web)
 * @param {string} deviceId - Optional device identifier
 */
export const registerPushToken = async (userId, token, platform = 'android', deviceId = null) => {
  try {
    // Check if token already exists for this user
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if token already registered
    const existingToken = user.expoPushTokens?.find(t => t.token === token);
    if (existingToken) {
      return { success: true, message: 'Token already registered' };
    }

    // Add new token
    await User.findByIdAndUpdate(userId, {
      $push: {
        expoPushTokens: {
          token,
          platform,
          deviceId,
          addedAt: new Date()
        }
      }
    });

    return { success: true, message: 'Token registered successfully' };
  } catch (error) {
    console.error('Register push token error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a push token for a user
 * @param {string} userId - User ID
 * @param {string} token - Expo push token to remove
 */
export const removePushToken = async (userId, token) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { expoPushTokens: { token } }
    });
    return { success: true, message: 'Token removed successfully' };
  } catch (error) {
    console.error('Remove push token error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendPushNotification,
  sendPushNotificationToMany,
  registerPushToken,
  removePushToken
};
