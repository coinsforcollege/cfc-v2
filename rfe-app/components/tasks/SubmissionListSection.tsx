'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, useColorScheme, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/Skeleton';
import { SubmissionCard } from './SubmissionCard';
import { tasksApi, TaskSubmission } from '@/src/api/tasks.api';
import { useAuth } from '@/src/contexts/AuthContext';
import { Clock, CheckCheck } from '@/components/navigation/icons';

interface SubmissionListSectionProps {
  type: 'pending' | 'completed';
}

export function SubmissionListSection({ type }: SubmissionListSectionProps) {
  const { token, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSubmissions = useCallback(async (pageNum: number, isRefresh = false) => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      if (pageNum === 1 && !isRefresh) {
        setLoading(true);
      }

      const response = type === 'pending'
        ? await tasksApi.getMySubmissions(token, { page: pageNum, limit: 20 })
        : await tasksApi.getMyCompleted(token, { page: pageNum, limit: 20 });

      if (response.success) {
        const newData = response.data || [];
        if (pageNum === 1) {
          setSubmissions(newData);
        } else {
          setSubmissions(prev => [...prev, ...newData]);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [token, isAuthenticated, type]);

  useEffect(() => {
    fetchSubmissions(1);
  }, [fetchSubmissions]);

  // Refetch when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!loading && !refreshing) {
        fetchSubmissions(1, true);
      }
    }, [fetchSubmissions, loading, refreshing])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchSubmissions(1, true);
  }, [fetchSubmissions]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSubmissions(nextPage);
    }
  }, [loadingMore, hasMore, loading, page, fetchSubmissions]);

  const renderItem = useCallback(({ item, index }: { item: TaskSubmission; index: number }) => (
    <SubmissionCard submission={item} index={index} />
  ), []);

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

    const EmptyIcon = type === 'pending' ? Clock : CheckCheck;
    const emptyTitle = type === 'pending' ? 'No Tasks In Review' : 'No Completed Tasks';
    const emptyMessage = type === 'pending'
      ? 'Tasks you submit for review will appear here'
      : 'Complete tasks to earn scholarship points';

    return (
      <VStack className="flex-1 items-center justify-center px-6 py-12">
        <Box
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? 'rgb(38, 38, 38)' : 'rgb(243, 244, 246)' }}
        >
          <EmptyIcon size={28} color={isDark ? 'rgb(115, 115, 115)' : 'rgb(156, 163, 175)'} />
        </Box>
        <Text className="text-typography-900 text-lg font-inter-bold text-center mb-2">
          {emptyTitle}
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          {emptyMessage}
        </Text>
      </VStack>
    );
  }, [loading, type, isDark]);

  if (!isAuthenticated) {
    return (
      <VStack className="flex-1 items-center justify-center px-6 py-12">
        <Text className="text-typography-900 text-lg font-inter-bold text-center mb-2">
          Login Required
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          Please log in to view your {type === 'pending' ? 'submissions' : 'completed tasks'}
        </Text>
      </VStack>
    );
  }

  if (loading) {
    return (
      <VStack className="px-4 pt-4" space="md">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} width="100%" height={100} borderRadius={16} />
        ))}
      </VStack>
    );
  }

  return (
    <FlatList
      data={submissions}
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
  );
}

export default SubmissionListSection;
