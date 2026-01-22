import config from '../config';

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  category: 'mining' | 'referral' | 'college' | 'milestone' | 'ambassador' | 'system' | 'task';
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: Notification;
}

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token: string
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      ...data,
    };
  }

  return data;
}

export const notificationsApi = {
  // Get notifications (paginated)
  async getAll(
    token: string,
    params?: { page?: number; limit?: number; category?: string; isRead?: boolean }
  ): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiRequest<NotificationsResponse>(
      `/notifications${query ? `?${query}` : ''}`,
      {},
      token
    );
  },

  // Get unread count
  async getUnreadCount(token: string): Promise<UnreadCountResponse> {
    return apiRequest<UnreadCountResponse>('/notifications/unread-count', {}, token);
  },

  // Mark single notification as read
  async markAsRead(id: string, token: string): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      `/notifications/${id}/read`,
      { method: 'PUT' },
      token
    );
  },

  // Mark single notification as unread
  async markAsUnread(id: string, token: string): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      `/notifications/${id}/unread`,
      { method: 'PUT' },
      token
    );
  },

  // Mark all notifications as read
  async markAllAsRead(token: string): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      '/notifications/mark-all-read',
      { method: 'PUT' },
      token
    );
  },

  // Delete a notification
  async delete(id: string, token: string): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      `/notifications/${id}`,
      { method: 'DELETE' },
      token
    );
  },

  // Clear all read notifications
  async clearRead(token: string): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      '/notifications/clear-read',
      { method: 'DELETE' },
      token
    );
  },

  // Register push notification token
  async registerPushToken(
    authToken: string,
    pushToken: string,
    platform: 'ios' | 'android' | 'web',
    deviceId?: string
  ): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      '/notifications/push-token',
      {
        method: 'POST',
        body: JSON.stringify({ token: pushToken, platform, deviceId }),
      },
      authToken
    );
  },

  // Remove push notification token
  async removePushToken(authToken: string, pushToken: string): Promise<NotificationResponse> {
    return apiRequest<NotificationResponse>(
      '/notifications/push-token',
      {
        method: 'DELETE',
        body: JSON.stringify({ token: pushToken }),
      },
      authToken
    );
  },
};

export default notificationsApi;
