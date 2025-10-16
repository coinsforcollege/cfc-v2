import apiClient from './apiClient';

export const notificationApi = {
  // Get notifications with pagination and filters
  getNotifications: (params = {}) => {
    const { page = 1, limit = 5, category, isRead } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (category) queryParams.append('category', category);
    if (isRead !== undefined) queryParams.append('isRead', isRead.toString());

    return apiClient.get(`/notifications?${queryParams.toString()}`);
  },

  // Get unread notification count
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),

  // Mark single notification as read
  markAsRead: (notificationId) => apiClient.put(`/notifications/${notificationId}/read`),

  // Mark all notifications as read
  markAllAsRead: () => apiClient.put('/notifications/mark-all-read'),

  // Delete single notification
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),

  // Clear all read notifications
  clearReadNotifications: () => apiClient.delete('/notifications/clear-read')
};
