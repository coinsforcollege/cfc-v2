'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ChevronLeft,
  Bell,
  CheckCheck,
  Trash2,
  Mail,
} from '@/components/navigation/icons';
import { notificationsApi, Notification } from '@/src/api/notifications.api';
import { useAuth } from '@/src/contexts/AuthContext';

const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
  },
};

function NotificationCard({
  notification,
  onPress,
  onDelete,
  onMarkUnread,
}: {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
  onMarkUnread: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const swipeableRef = useRef<Swipeable>(null);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, -60, 0],
      outputRange: [1, 0.9, 0.5],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-60, -20, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    const handleDelete = () => {
      swipeableRef.current?.close();
      onDelete();
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: '#ef4444',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 24,
          opacity,
        }}
      >
        <Pressable onPress={handleDelete}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Trash2 size={20} color="#ffffff" />
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 60, 80],
      outputRange: [0.5, 0.9, 1],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [0, 20, 60],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });

    const handleMarkUnread = () => {
      swipeableRef.current?.close();
      onMarkUnread();
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: '#3b82f6',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingLeft: 24,
          opacity,
        }}
      >
        <Pressable onPress={handleMarkUnread}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Mail size={20} color="#ffffff" />
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      rightThreshold={60}
      leftThreshold={60}
      overshootRight={true}
      overshootLeft={true}
      overshootFriction={8}
      friction={2}
    >
      <Pressable
        onPress={onPress}
        className="bg-background-0"
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <HStack className="items-start py-3 mx-4 border-b border-outline-100">
          {/* Unread dot */}
          <Box className="w-6 pt-1.5">
            {!notification.isRead && (
              <Box className="w-2 h-2 rounded-full bg-primary-500" />
            )}
          </Box>

          {/* Content */}
          <VStack className="flex-1 pr-2">
            <HStack className="justify-between items-start mb-1">
              <Text
                className={`text-sm flex-1 mr-3 ${
                  notification.isRead
                    ? 'font-inter-regular text-typography-600'
                    : 'font-inter-bold text-typography-900'
                }`}
                numberOfLines={2}
              >
                {notification.title}
              </Text>
              <Text className="text-typography-400 text-xs flex-shrink-0">
                {formatTime(notification.createdAt)}
              </Text>
            </HStack>
            <Text
              className={`text-sm pr-2 ${
                notification.isRead ? 'text-typography-400' : 'text-typography-500'
              }`}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    </Swipeable>
  );
}

export default function NotificationsScreen() {
  const { token, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        if (pageNum === 1 && !isRefresh) {
          setLoading(true);
        }

        const response = await notificationsApi.getAll(token, {
          page: pageNum,
          limit: 20,
        });

        if (response.success) {
          const newData = response.data.notifications || [];
          if (pageNum === 1) {
            setNotifications(newData);
          } else {
            setNotifications((prev) => [...prev, ...newData]);
          }
          setHasMore(response.data.pagination.hasNextPage);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [token, isAuthenticated]
  );

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  useFocusEffect(
    useCallback(() => {
      if (!loading && !refreshing) {
        fetchNotifications(1, true);
      }
    }, [fetchNotifications, loading, refreshing])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  }, [loadingMore, hasMore, loading, page, fetchNotifications]);

  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      // Mark as read
      if (!notification.isRead && token) {
        try {
          await notificationsApi.markAsRead(notification._id, token);
          setNotifications((prev) =>
            prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
          );
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      }

      // Navigate based on type
      if (notification.type === 'task_approved' || notification.type === 'task_rejected') {
        if (notification.data?.taskId) {
          router.push(`/(app)/tasks/${notification.data.taskId}`);
        }
      } else if (notification.type === 'task_points_earned') {
        router.push('/(app)/tasks');
      }
    },
    [token]
  );

  const handleDelete = useCallback(
    async (notificationId: string) => {
      if (!token) return;

      // Optimistically remove from list
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      try {
        await notificationsApi.delete(notificationId, token);
      } catch (error) {
        console.error('Error deleting notification:', error);
        // Refetch on error
        fetchNotifications(1, true);
      }
    },
    [token, fetchNotifications]
  );

  const handleMarkAllRead = useCallback(async () => {
    if (!token) return;
    try {
      await notificationsApi.markAllAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [token]);

  const handleMarkUnread = useCallback(
    async (notificationId: string) => {
      if (!token) return;

      // Optimistically update
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: false } : n))
      );

      try {
        await notificationsApi.markAsUnread(notificationId, token);
      } catch (error) {
        console.error('Error marking notification as unread:', error);
        // Revert on error
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
        );
      }
    },
    [token]
  );

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCard
        notification={item}
        onPress={() => handleNotificationPress(item)}
        onDelete={() => handleDelete(item._id)}
        onMarkUnread={() => handleMarkUnread(item._id)}
      />
    ),
    [handleNotificationPress, handleDelete, handleMarkUnread]
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <Box className="py-4 items-center">
        <ActivityIndicator size="small" color={isDark ? '#a3a3a3' : '#737373'} />
      </Box>
    );
  }, [loadingMore, isDark]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;

    return (
      <VStack className="flex-1 items-center justify-center px-6 py-12">
        <Box
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? 'rgb(38, 38, 38)' : 'rgb(243, 244, 246)' }}
        >
          <Bell size={28} color={isDark ? 'rgb(115, 115, 115)' : 'rgb(156, 163, 175)'} />
        </Box>
        <Text className="text-typography-900 text-lg font-inter-bold text-center mb-2">
          No Notifications
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          You're all caught up! Check back later for updates.
        </Text>
      </VStack>
    );
  }, [loading, isDark]);

  const topPadding = Math.max(insets.top, Platform.OS === 'ios' ? 47 : 24);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isAuthenticated) {
    return (
      <Box className="flex-1 bg-background-0">
        <Box style={{ paddingTop: topPadding }} className="px-4 py-3">
          <HStack className="items-center">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Box className="w-9 h-9 items-center justify-center mr-2">
                <ChevronLeft size={22} strokeWidth={2.5} color={iconColors.primary} />
              </Box>
            </Pressable>
            <Text className="text-lg font-inter-black text-typography-900">Notifications</Text>
          </HStack>
        </Box>
        <VStack className="flex-1 items-center justify-center px-6">
          <Text className="text-typography-900 text-lg font-inter-bold text-center mb-2">
            Login Required
          </Text>
          <Text className="text-typography-500 text-sm text-center">
            Please log in to view your notifications
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <Box style={{ paddingTop: topPadding }} className="bg-background-0 border-b border-outline-100">
        <Box className="px-4 py-3">
          <HStack className="items-center justify-between">
            <HStack className="items-center">
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Box className="w-9 h-9 items-center justify-center mr-2">
                  <ChevronLeft size={22} strokeWidth={2.5} color={iconColors.primary} />
                </Box>
              </Pressable>
              <Text className="text-lg font-inter-black text-typography-900">Notifications</Text>
              {unreadCount > 0 && (
                <Box className="ml-2 px-2 py-0.5 rounded-full bg-primary-500">
                  <Text className="text-xs font-inter-bold text-white">{unreadCount}</Text>
                </Box>
              )}
            </HStack>

            {unreadCount > 0 && (
              <Pressable
                onPress={handleMarkAllRead}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <HStack className="items-center">
                  <CheckCheck size={16} color={iconColors.secondary} />
                  <Text className="text-typography-600 text-sm font-inter-medium ml-1">
                    Mark all read
                  </Text>
                </HStack>
              </Pressable>
            )}
          </HStack>
        </Box>
      </Box>

      {/* Loading State */}
      {loading ? (
        <VStack className="px-4 pt-4" space="md">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width="100%" height={70} borderRadius={8} />
          ))}
        </VStack>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={isDark ? '#a3a3a3' : '#737373'}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </Box>
  );
}
