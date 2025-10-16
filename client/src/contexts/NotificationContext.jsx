import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationApi } from '../api/notification.api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  // Initialize audio for notification chime
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Could not play notification sound:', err);
      });
    }
  }, []);

  // Fetch initial notifications and unread count
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications({ page: pageNum, limit: 5 });

      if (append) {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      } else {
        setNotifications(response.data.notifications);
      }

      setHasMore(response.data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.count);

      // Show tooltip if there are unread notifications on login
      if (response.data.count > 0) {
        setShowTooltip(true);
        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user, token]);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    fetchNotifications(page + 1, true);
  }, [hasMore, isLoading, page, fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);

      // Update local state
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));

      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Clear all read notifications
  const clearReadNotifications = useCallback(async () => {
    try {
      await notificationApi.clearReadNotifications();

      // Update local state - keep only unread
      setNotifications(prev => prev.filter(notif => !notif.isRead));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  }, []);

  // Hide tooltip manually
  const hideTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    // Fetch initial data
    fetchNotifications();
    fetchUnreadCount();

    // Create socket connection
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('📬 Connected to notification WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('📬 Disconnected from notification WebSocket');
    });

    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      console.log('📬 New notification received:', notification);

      // Add to notifications list
      setNotifications(prev => [notification, ...prev]);

      // Increment unread count
      setUnreadCount(prev => prev + 1);

      // Play notification sound
      playNotificationSound();

      // Show tooltip briefly
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    });

    socket.on('connect_error', (error) => {
      console.error('Notification WebSocket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token, fetchNotifications, fetchUnreadCount, playNotificationSound]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    showTooltip,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    hideTooltip
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
