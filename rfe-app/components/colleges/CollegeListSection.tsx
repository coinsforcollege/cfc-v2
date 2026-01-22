'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { Globe } from '@/components/navigation/icons';
import { CollegeCard } from './CollegeCard';
import { collegesApi, College } from '@/src/api/colleges.api';

// Theme colors (from config.ts)
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
  { code: 'CN', name: 'China', flag: 'cn' },
  { code: 'KR', name: 'South Korea', flag: 'kr' },
];

interface CollegeListSectionProps {
  searchQuery?: string;
  numColumns?: number;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const PAGE_SIZE = 20;

export function CollegeListSection({
  searchQuery,
  numColumns = 2,
  ListHeaderComponent,
}: CollegeListSectionProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const { width } = useWindowDimensions();

  const horizontalPadding = 16;
  const gap = 12;
  const cardWidth = (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns;

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

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

  const fetchColleges = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }
      setError(null);

      // Find the full country name for the API (backend expects full name, not code)
      const selectedCountryObj = COUNTRIES.find(c => c.code === selectedCountry);
      const countryFilter = selectedCountry === 'ALL' ? undefined : selectedCountryObj?.name;

      const response = await collegesApi.getAll({
        search: debouncedSearch,
        country: countryFilter,
        page: pageNum,
        limit: PAGE_SIZE,
      });

      const newColleges = response.colleges;
      const pagination = response.pagination;

      if (isRefresh || pageNum === 1) {
        setColleges(newColleges);
      } else {
        setColleges(prev => [...prev, ...newColleges]);
      }

      setHasMore(pagination.hasNextPage);
      setTotalCount(pagination.totalCount);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, selectedCountry]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchColleges(1, true);
  }, [debouncedSearch, selectedCountry]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchColleges(1, true);
  }, [fetchColleges]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      fetchColleges(page + 1, false);
    }
  }, [loadingMore, hasMore, loading, page, fetchColleges]);

  const renderCollegeCard = useCallback(({ item, index }: { item: College; index: number }) => (
    <Box
      style={{
        width: cardWidth,
        marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
        marginBottom: gap,
      }}
    >
      <CollegeCard college={item} index={index} />
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

  const renderEmptyList = useCallback(() => {
    if (loading) {
      return (
        <Box className="py-12 items-center">
          <ActivityIndicator size="large" color={themeColors.indicator} />
          <Text className="text-typography-500 text-sm mt-3">
            Loading colleges...
          </Text>
        </Box>
      );
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
        <Text className="text-typography-900 text-base font-bold mb-1">
          No colleges found
        </Text>
        <Text className="text-typography-500 text-sm text-center">
          {debouncedSearch
            ? `No results for "${debouncedSearch}"`
            : 'Try adjusting your filters'}
        </Text>
      </Box>
    );
  }, [loading, error, themeColors.indicator, debouncedSearch]);

  const keyExtractor = useCallback((item: College) => item._id, []);

  const renderListHeader = useCallback(() => (
    <>
      {ListHeaderComponent && (
        typeof ListHeaderComponent === 'function'
          ? <ListHeaderComponent />
          : ListHeaderComponent
      )}

      {/* All Colleges Section */}
      <Box style={{ marginTop: 24 }}>
        <Box className="px-4 mb-3">
          <Text className="text-typography-900 font-black text-lg tracking-tight">
            All Colleges
          </Text>
        </Box>

        {/* Country Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          style={{ marginBottom: 16 }}
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
                    className={`text-xs font-semibold ${
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
  ), [ListHeaderComponent, selectedCountry]);

  return (
    <FlatList
      key={`college-list-${numColumns}`}
      data={colleges}
      keyExtractor={keyExtractor}
      renderItem={renderCollegeCard}
      numColumns={numColumns}
      contentContainerStyle={{
        paddingHorizontal: horizontalPadding,
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
      ListHeaderComponentStyle={{ marginHorizontal: -horizontalPadding }}
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

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default CollegeListSection;
