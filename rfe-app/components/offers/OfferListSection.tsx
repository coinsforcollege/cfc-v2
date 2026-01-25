'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  FlatList,
  ScrollView,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/Skeleton';
import { Globe } from '@/components/navigation/icons';
import { OfferCard } from './OfferCard';
import { offersApi, ScholarshipOffer } from '@/src/api/offers.api';
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

// Countries with flags
const COUNTRIES = [
  { code: 'ALL', name: 'All', flag: null },
  { code: 'US', name: 'United States', flag: 'us' },
  { code: 'UK', name: 'United Kingdom', flag: 'gb' },
  { code: 'CA', name: 'Canada', flag: 'ca' },
  { code: 'AU', name: 'Australia', flag: 'au' },
  { code: 'DE', name: 'Germany', flag: 'de' },
  { code: 'FR', name: 'France', flag: 'fr' },
  { code: 'NL', name: 'Netherlands', flag: 'nl' },
  { code: 'SG', name: 'Singapore', flag: 'sg' },
  { code: 'JP', name: 'Japan', flag: 'jp' },
  { code: 'IN', name: 'India', flag: 'in' },
];

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface OfferListSectionProps {
  status: 'active' | 'accepted' | 'rejected';
  searchQuery?: string;
  refreshTrigger?: number;
  numColumns?: number;
  ListHeaderComponent?: React.ReactElement | null;
}

const CARD_HEIGHT = 200;

function SkeletonCard({ width }: { width: number }) {
  return (
    <Box
      className="bg-background-50 rounded-2xl overflow-hidden"
      style={{ height: CARD_HEIGHT, width }}
    >
      {/* Top image area */}
      <Skeleton width="100%" height={90} borderRadius={0} />
      {/* Content area */}
      <Box className="px-3 pt-2 pb-2 flex-1 justify-between">
        <Skeleton width="90%" height={16} borderRadius={4} />
        <Skeleton width="60%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
        <Skeleton width="40%" height={10} borderRadius={4} style={{ marginTop: 6 }} />
      </Box>
    </Box>
  );
}

export function OfferListSection({
  status,
  searchQuery = '',
  refreshTrigger,
  numColumns = 2,
  ListHeaderComponent,
}: OfferListSectionProps) {
  const { token } = useAuth();
  const [offers, setOffers] = useState<ScholarshipOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const { width } = useWindowDimensions();

  const horizontalPadding = 16;
  const gap = 12;
  const cardWidth = (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;

  const fetchData = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    if (!token) return;

    try {
      if (pageNum === 1 && !isRefresh) {
        setLoading(true);
      }
      setError(null);

      const response = await offersApi.getOffers(token, {
        status,
        page: pageNum,
        limit: 20,
      });

      if (isRefresh || pageNum === 1) {
        setOffers(response.data || []);
      } else {
        setOffers(prev => [...prev, ...(response.data || [])]);
      }

      const totalPages = response.pagination?.pages || 1;
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [token, status]);

  // Fetch on mount and when status/refreshTrigger changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
  }, [status, refreshTrigger]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchData(1, true);
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      fetchData(page + 1, false);
    }
  }, [loadingMore, hasMore, loading, page, fetchData]);

  // Filter by search query and country
  const normalizedSearch = searchQuery.toLowerCase().trim();

  const filteredOffers = offers.filter(o => {
    // Country filter
    if (selectedCountry !== 'ALL') {
      const countryObj = COUNTRIES.find(c => c.code === selectedCountry);
      if (countryObj && o.college?.country !== countryObj.name) {
        return false;
      }
    }

    // Search filter
    if (normalizedSearch) {
      return (
        o.title.toLowerCase().includes(normalizedSearch) ||
        o.college?.name?.toLowerCase().includes(normalizedSearch) ||
        o.college?.country?.toLowerCase().includes(normalizedSearch)
      );
    }

    return true;
  });

  const renderItem = useCallback(({ item, index }: { item: ScholarshipOffer; index: number }) => {
    return (
      <Box
        style={{
          width: cardWidth,
          marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
          marginBottom: gap,
        }}
      >
        <OfferCard offer={item} index={index} />
      </Box>
    );
  }, [cardWidth, numColumns, gap]);

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

    if (normalizedSearch || selectedCountry !== 'ALL') {
      return (
        <Box className="py-12 items-center px-4">
          <Text className="text-typography-900 text-base font-inter-bold mb-1">
            No results found
          </Text>
          <Text className="text-typography-500 text-sm text-center">
            {normalizedSearch
              ? `No offers match "${searchQuery}"`
              : 'No offers available for this country'}
          </Text>
        </Box>
      );
    }

    const emptyMessages = {
      active: {
        title: 'No offers yet',
        subtitle: 'Check back later for scholarship opportunities',
      },
      accepted: {
        title: 'No accepted offers',
        subtitle: 'Offers you accept will appear here',
      },
      rejected: {
        title: 'No rejected offers',
        subtitle: 'Offers you decline will appear here',
      },
    };

    const message = emptyMessages[status];

    return (
      <Box className="py-12 items-center px-4">
        <Text className="text-typography-900 text-base font-inter-bold mb-1">
          {message.title}
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          {message.subtitle}
        </Text>
      </Box>
    );
  }, [loading, error, normalizedSearch, searchQuery, status, selectedCountry, renderSkeletonGrid]);

  const keyExtractor = useCallback((item: ScholarshipOffer) => item._id, []);

  // List header with featured card + country filter
  const renderListHeader = useCallback(() => (
    <>
      {/* Featured card (passed as ListHeaderComponent) */}
      {ListHeaderComponent}

      {/* Country Filter */}
      <Box style={{ marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0, gap: 8 }}
        >
          {COUNTRIES.map((country) => {
            const isSelected = selectedCountry === country.code;
            return (
              <Pressable
                key={country.code}
                onPress={() => setSelectedCountry(country.code)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Box
                  className={`px-3 rounded-full flex-row items-center ${
                    isSelected
                      ? 'bg-primary-500'
                      : 'bg-background-100 border border-outline-200'
                  }`}
                  style={{ height: 36 }}
                >
                  {country.code === 'ALL' ? (
                    <Globe
                      size={16}
                      color={isSelected ? 'white' : themeColors.indicator}
                      style={{ marginRight: 6 }}
                    />
                  ) : country.flag ? (
                    <Text style={{ fontSize: 16, marginRight: 6 }}>
                      {getFlagEmoji(country.flag)}
                    </Text>
                  ) : null}
                  <Text
                    className={`text-xs font-inter-semibold ${
                      isSelected ? 'text-typography-0' : 'text-typography-700'
                    }`}
                  >
                    {country.code === 'ALL' ? 'All' : country.code}
                  </Text>
                </Box>
              </Pressable>
            );
          })}
        </ScrollView>
      </Box>
    </>
  ), [ListHeaderComponent, selectedCountry, themeColors.indicator]);

  return (
    <FlatList
      key={`offer-list-${numColumns}-${status}`}
      data={filteredOffers}
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
      ListHeaderComponent={renderListHeader}
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

export default OfferListSection;
