'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/Skeleton';
import { FolderCard } from './FolderCard';
import { DocumentCard } from './DocumentCard';
import { documentsApi, Folder, Document } from '@/src/api/documents.api';
import { useAuth } from '@/src/contexts/AuthContext';

// Theme colors
const THEME_COLORS = {
  light: {
    indicator: 'rgb(81, 100, 246)',
  },
  dark: {
    indicator: 'rgb(119, 134, 248)',
  },
};

interface DocumentListSectionProps {
  currentFolderId: string | null;
  onFolderPress: (folder: Folder) => void;
  onDocumentPress: (document: Document) => void;
  onFolderLongPress?: (folder: Folder) => void;
  onDocumentLongPress?: (document: Document) => void;
  selectedItems?: Set<string>;
  numColumns?: number;
  refreshTrigger?: number;
  searchQuery?: string;
}

type ListItem =
  | { type: 'folder'; data: Folder }
  | { type: 'document'; data: Document };

const CARD_HEIGHT = 130;

function SkeletonCard({ width }: { width: number }) {
  return (
    <Box
      className="bg-background-50 rounded-2xl overflow-hidden"
      style={{ height: CARD_HEIGHT, width }}
    >
      <Box className="flex-1 items-center justify-center" style={{ paddingTop: 16 }}>
        <Skeleton width={56} height={56} borderRadius={16} />
      </Box>
      <Box className="px-3 pb-3">
        <Skeleton width="80%" height={14} borderRadius={4} style={{ alignSelf: 'center' }} />
        <Skeleton width="40%" height={10} borderRadius={4} style={{ marginTop: 4, alignSelf: 'center' }} />
      </Box>
    </Box>
  );
}

export function DocumentListSection({
  currentFolderId,
  onFolderPress,
  onDocumentPress,
  onFolderLongPress,
  onDocumentLongPress,
  selectedItems,
  numColumns = 2,
  refreshTrigger,
  searchQuery = '',
}: DocumentListSectionProps) {
  const { token } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
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

  const fetchData = useCallback(async (pageNum: number = 1, isRefresh: boolean = false, isSearching: boolean = false) => {
    if (!token) return;

    try {
      if (pageNum === 1 && !isRefresh) {
        setLoading(true);
      }
      setError(null);

      // When searching, fetch all documents (no folderId filter)
      // When not searching, fetch from current folder
      const response = await documentsApi.getDocuments(token, {
        folderId: isSearching ? undefined : (currentFolderId || undefined),
        page: pageNum,
        limit: isSearching ? 100 : 20,
        all: isSearching ? true : undefined,
      });

      // On first page, update folders
      if (pageNum === 1) {
        setFolders(response.data.folders || []);
      }

      if (isRefresh || pageNum === 1) {
        setDocuments(response.data.documents || []);
      } else {
        setDocuments(prev => [...prev, ...(response.data.documents || [])]);
      }

      const totalPages = response.pagination?.pages || 1;
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [token, currentFolderId]);

  // Fetch on mount and when folder/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    const isSearching = searchQuery.trim().length > 0;
    fetchData(1, true, isSearching);
  }, [currentFolderId, refreshTrigger, searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchData(1, true);
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && folders.length === 0) {
      // Only paginate documents, not folders
      setLoadingMore(true);
      fetchData(page + 1, false);
    }
  }, [loadingMore, hasMore, loading, page, fetchData, folders.length]);

  // Filter and combine folders and documents into a single list
  const normalizedSearch = searchQuery.toLowerCase().trim();

  const filteredFolders = normalizedSearch
    ? folders.filter(f => f.name.toLowerCase().includes(normalizedSearch))
    : folders;

  const filteredDocuments = normalizedSearch
    ? documents.filter(d => d.name.toLowerCase().includes(normalizedSearch))
    : documents;

  const listItems: ListItem[] = [
    ...filteredFolders.map(f => ({ type: 'folder' as const, data: f })),
    ...filteredDocuments.map(d => ({ type: 'document' as const, data: d })),
  ];

  const renderItem = useCallback(({ item, index }: { item: ListItem; index: number }) => {
    const isFolder = item.type === 'folder';
    const itemId = item.data._id;
    const isSelected = selectedItems?.has(itemId);

    return (
      <Box
        style={{
          width: cardWidth,
          marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
          marginBottom: gap,
        }}
      >
        {isFolder ? (
          <FolderCard
            folder={item.data as Folder}
            onPress={onFolderPress}
            onLongPress={onFolderLongPress}
            isSelected={isSelected}
          />
        ) : (
          <DocumentCard
            document={item.data as Document}
            onPress={onDocumentPress}
            onLongPress={onDocumentLongPress}
            isSelected={isSelected}
          />
        )}
      </Box>
    );
  }, [cardWidth, numColumns, gap, onFolderPress, onDocumentPress, onFolderLongPress, onDocumentLongPress, selectedItems]);

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
            <SkeletonCard width={cardWidth} />
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

    if (normalizedSearch) {
      return (
        <Box className="py-12 items-center px-4">
          <Text className="text-typography-900 text-base font-inter-bold mb-1">
            No results found
          </Text>
          <Text className="text-typography-500 text-sm text-center">
            No files or folders match "{searchQuery}"
          </Text>
        </Box>
      );
    }

    return (
      <Box className="py-12 items-center px-4">
        <Text className="text-typography-900 text-base font-inter-bold mb-1">
          No files yet
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          {currentFolderId
            ? 'This folder is empty'
            : 'Upload files or create folders to get started'}
        </Text>
      </Box>
    );
  }, [loading, error, currentFolderId, normalizedSearch, searchQuery, renderSkeletonGrid]);

  const keyExtractor = useCallback((item: ListItem) => `${item.type}-${item.data._id}`, []);

  return (
    <FlatList
      key={`doc-list-${numColumns}`}
      data={listItems}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
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
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      windowSize={5}
      removeClippedSubviews={false}
      nestedScrollEnabled={true}
      style={{ flex: 1 }}
    />
  );
}

export default DocumentListSection;
