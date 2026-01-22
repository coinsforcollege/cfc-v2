'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  RefreshControl,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/Skeleton';
import { TaskCard } from './TaskCard';
import { tasksApi, Task } from '@/src/api/tasks.api';
import { useAuth } from '@/src/contexts/AuthContext';

const CARD_HEIGHT = 200;

// Theme colors
const THEME_COLORS = {
  light: {
    indicator: 'rgb(81, 100, 246)',
  },
  dark: {
    indicator: 'rgb(119, 134, 248)',
  },
};

interface TaskListSectionProps {
  searchQuery?: string;
  selectedCategory: string;
  numColumns?: number;
}

const PAGE_SIZE = 20;

function SkeletonTaskCard({ width }: { width: number }) {
  return (
    <Box
      className="bg-background-0 rounded-2xl overflow-hidden border border-outline-100"
      style={{ height: CARD_HEIGHT, width }}
    >
      {/* Thumbnail skeleton */}
      <Box style={{ height: 90 }}>
        <Skeleton width="100%" height={90} borderRadius={0} />
        {/* Activity badge */}
        <Box className="absolute top-2 left-2">
          <Skeleton width={70} height={22} borderRadius={8} />
        </Box>
      </Box>

      {/* Content skeleton */}
      <Box className="px-3 pt-2.5 pb-2">
        {/* Title */}
        <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
        {/* Category chips */}
        <Box className="flex-row gap-1">
          <Skeleton width={50} height={18} borderRadius={4} />
          <Skeleton width={60} height={18} borderRadius={4} />
        </Box>
      </Box>
    </Box>
  );
}

export function TaskListSection({
  searchQuery,
  selectedCategory,
  numColumns = 2,
}: TaskListSectionProps) {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const { width } = useWindowDimensions();

  const horizontalPadding = 16;
  const gap = 12;
  const cardWidth = (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchTasks = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (pageNum === 1 && !isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response = await tasksApi.getAll({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: debouncedSearch,
        page: pageNum,
        limit: PAGE_SIZE,
      }, token || undefined);

      const newTasks = response.data;
      const pagination = response.pagination;

      if (isRefresh || pageNum === 1) {
        setTasks(newTasks);
      } else {
        setTasks(prev => [...prev, ...newTasks]);
      }

      setHasMore(pagination.hasNextPage);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, selectedCategory, token]);

  // Refetch when search or category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchTasks(1, true);
  }, [debouncedSearch, selectedCategory]);

  // Refetch when screen is focused (e.g., returning from task detail after completing)
  useFocusEffect(
    useCallback(() => {
      // Only refetch if not already loading
      if (!loading && !refreshing) {
        fetchTasks(1, true);
      }
    }, [fetchTasks, loading, refreshing])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchTasks(1, true);
  }, [fetchTasks]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      fetchTasks(page + 1, false);
    }
  }, [loadingMore, hasMore, loading, page, fetchTasks]);

  const renderTaskCard = useCallback(({ item, index }: { item: Task; index: number }) => (
    <Box
      style={{
        width: cardWidth,
        marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
        marginBottom: gap,
      }}
    >
      <TaskCard task={item} index={index} />
    </Box>
  ), [cardWidth, numColumns, gap]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <Box className="py-4 items-center">
        <ActivityIndicator size="small" color={themeColors.indicator} />
      </Box>
    );
  }, [loadingMore, themeColors.indicator]);

  const renderSkeletonGrid = useCallback(() => {
    const skeletonCount = numColumns * 3;
    const rows = [];
    for (let i = 0; i < skeletonCount; i += numColumns) {
      const rowItems = [];
      for (let j = 0; j < numColumns && i + j < skeletonCount; j++) {
        rowItems.push(
          <Box
            key={i + j}
            style={{
              width: cardWidth,
              marginRight: j < numColumns - 1 ? gap : 0,
              marginBottom: gap,
            }}
          >
            <SkeletonTaskCard width={cardWidth} />
          </Box>
        );
      }
      rows.push(
        <Box key={`row-${i}`} className="flex-row">
          {rowItems}
        </Box>
      );
    }
    return <Box style={{ paddingHorizontal: horizontalPadding }}>{rows}</Box>;
  }, [numColumns, cardWidth, gap, horizontalPadding]);

  const renderEmptyList = useCallback(() => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <Box className="py-12 items-center px-4">
          <Text className="text-error-500 text-sm text-center mb-2">
            {error}
          </Text>
          <Text className="text-typography-500 text-xs text-center">
            Pull down to retry
          </Text>
        </Box>
      );
    }

    return (
      <Box className="py-12 items-center px-4">
        <Text className="text-typography-900 text-base font-inter-bold mb-1">
          No tasks found
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          {debouncedSearch
            ? `No results for "${debouncedSearch}"`
            : 'No active tasks available'}
        </Text>
      </Box>
    );
  }, [loading, error, debouncedSearch, renderSkeletonGrid]);

  const keyExtractor = useCallback((item: Task) => item._id, []);

  return (
    <FlatList
      key={`task-list-${numColumns}`}
      data={tasks}
      keyExtractor={keyExtractor}
      renderItem={renderTaskCard}
      numColumns={numColumns}
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
        paddingTop: 16,
        paddingBottom: 100,
        flexGrow: 1,
      }}
      columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={themeColors.indicator}
          colors={[themeColors.indicator]}
        />
      }
      ListEmptyComponent={renderEmptyList}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      initialNumToRender={PAGE_SIZE}
      maxToRenderPerBatch={PAGE_SIZE}
      windowSize={5}
      removeClippedSubviews={true}
      style={{ flex: 1 }}
    />
  );
}

export default TaskListSection;
