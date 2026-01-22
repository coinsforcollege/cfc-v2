'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ChevronLeft,
  Bell,
  CheckCheck,
  Coins,
  AlertCircle,
  Zap,
  Gift,
  Award,
  CheckCircle,
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

// Notification type config
const NOTIFICATION_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bgColor: string }> = {
  task_approved: { icon: CheckCircle, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  task_rejected: { icon: AlertCircle, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  task_points_earned: { icon: Coins, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
  mining_completed: { icon: Zap, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)' },
  token_milestone: { icon: Award, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  referral_bonus_earned: { icon: Gift, color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
  default: { icon: Bell, color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.15)' },
};

function NotificationCard({
  notification,
  onPress,
  onMarkRead,
}: {
  notification: Notification;
  onPress: () => void;
  onMarkRead: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const config = NOTIFICATION_CONFIG[notification.type] || NOTIFICATION_CONFIG.default;
  const IconComponent = config.icon;

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

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Box
        className={`mx-4 mb-3 p-4 rounded-2xl border ${
          notification.isRead
            ? 'bg-background-0 border-outline-100'
            : 'bg-primary-50 border-primary-200'
        }`}
      >
        <HStack className="items-start">
          {/* Icon */}
          <Box
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: config.bgColor }}
          >
            <IconComponent size={20} color={config.color} />
          </Box>

          {/* Content */}
          <VStack className="flex-1">
            <HStack className="justify-between items-start mb-1">
              <Text
                className={`text-sm font-inter-bold flex-1 mr-2 ${
                  notification.isRead ? 'text-typography-700' : 'text-typography-900'
                }`}
                numberOfLines={2}
              >
                {notification.title}
              </Text>
              <Text className="text-typography-400 text-xs">
                {formatTime(notification.createdAt)}
              </Text>
            </HStack>
            <Text
              className={`text-sm ${
                notification.isRead ? 'text-typography-500' : 'text-typography-600'
              }`}
              numberOfLines={2}
            >
              {notification.message}
            </Text>

            {/* Points badge for task_points_earned */}
            {notification.type === 'task_points_earned' && notification.data?.points && (
              <Box className="mt-2">
                <Box
                  className="self-start px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
                >
                  <Text className="text-xs font-inter-bold" style={{ color: '#f59e0b' }}>
                    +{notification.data.points} SP
                  </Text>
                </Box>
              </Box>
            )}
          </VStack>

          {/* Unread indicator */}
          {!notification.isRead && (
            <Box className="w-2 h-2 rounded-full bg-primary-500 ml-2 mt-1" />
          )}
        </HStack>
      </Box>
    </Pressable>
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

  const handleMarkAllRead = useCallback(async () => {
    if (!token) return;
    try {
      await notificationsApi.markAllAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [token]);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCard
        notification={item}
        onPress={() => handleNotificationPress(item)}
        onMarkRead={() => {}}
      />
    ),
    [handleNotificationPress]
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
            <Skeleton key={i} width="100%" height={90} borderRadius={16} />
          ))}
        </VStack>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100, flexGrow: 1 }}
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
