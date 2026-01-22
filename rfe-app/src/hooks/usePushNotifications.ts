import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { notificationsApi } from '../api/notifications.api';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const { token: authToken, isAuthenticated } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Register for push notifications
  const registerForPushNotifications = useCallback(async () => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    try {
      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission not granted');
        return null;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      const pushToken = tokenData.data;

      // Android: Set up notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      return pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }, []);

  // Register token with backend
  const registerTokenWithBackend = useCallback(async (pushToken: string) => {
    if (!authToken) return;

    try {
      await notificationsApi.registerPushToken(
        authToken,
        pushToken,
        Platform.OS as 'ios' | 'android' | 'web'
      );
      console.log('Push token registered with backend');
    } catch (error) {
      console.error('Error registering push token with backend:', error);
    }
  }, [authToken]);

  // Handle notification response (when user taps notification)
  const handleNotificationResponse = useCallback((response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;

    if (data?.type === 'task_approved' || data?.type === 'task_rejected') {
      if (data?.taskId) {
        router.push(`/(app)/tasks/${data.taskId}`);
      }
    } else if (data?.type === 'task_points_earned') {
      router.push('/(app)/tasks');
    } else {
      // Default: go to notifications page
      router.push('/(app)/notifications');
    }
  }, []);

  // Initialize push notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const initPushNotifications = async () => {
      const pushToken = await registerForPushNotifications();
      if (pushToken && isMounted) {
        setExpoPushToken(pushToken);
        await registerTokenWithBackend(pushToken);
      }
    };

    initPushNotifications();

    // Listen for incoming notifications (foreground)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for notification responses (user taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, registerForPushNotifications, registerTokenWithBackend, handleNotificationResponse]);

  return {
    expoPushToken,
    notification,
  };
}

export default usePushNotifications;
