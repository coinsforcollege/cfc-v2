'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Pressable,
  TextInput,
  useWindowDimensions,
  useColorScheme,
  Platform,
  Image,
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/src/contexts/AuthContext';
import { Search, ChevronLeft, X, Award } from '@/components/navigation/icons';
import { OfferListSection } from '@/components/offers/OfferListSection';
import { RecommendedOfferCard } from '@/components/offers/RecommendedOfferCard';
import { offersApi } from '@/src/api/offers.api';

const TABLET_BREAKPOINT = 768;

// Theme colors for icons
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

// Tab configuration
const TABS = [
  { key: 'active', label: 'Active' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
] as const;

type TabKey = typeof TABS[number]['key'];

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Pressable
      onPress={() => router.push('/(app)/profile')}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Box className="w-9 h-9 rounded-full bg-primary-500 items-center justify-center">
        <Text className="text-xs font-inter-bold text-typography-0">
          {initials || 'U'}
        </Text>
      </Box>
    </Pressable>
  );
}

// Format currency
function formatCurrency(value: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

export default function OffersScreen() {
  const { width } = useWindowDimensions();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalScholarship, setTotalScholarship] = useState<number>(0);
  const [scholarshipCurrency, setScholarshipCurrency] = useState<string>('USD');

  // Refs for scroll sync
  const scrollViewRef = useRef<ScrollView>(null);
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const isTabPressScroll = useRef(false);

  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [scholarshipLabel, setScholarshipLabel] = useState<'accepted' | 'received'>('received');

  // Fetch total scholarship value - accepted takes priority, otherwise show active (received)
  const fetchTotalScholarship = useCallback(async () => {
    if (!token) return;
    try {
      // First check accepted offers
      const acceptedResponse = await offersApi.getOffers(token, { status: 'accepted', limit: 100 });
      if (acceptedResponse.data && acceptedResponse.data.length > 0) {
        const total = acceptedResponse.data.reduce((sum, offer) => sum + offer.totalValue, 0);
        setTotalScholarship(total);
        setScholarshipCurrency(acceptedResponse.data[0].currency || 'USD');
        setScholarshipLabel('accepted');
      } else {
        // No accepted offers, show active (received) offers total
        const activeResponse = await offersApi.getOffers(token, { status: 'active', limit: 100 });
        if (activeResponse.data && activeResponse.data.length > 0) {
          const total = activeResponse.data.reduce((sum, offer) => sum + offer.totalValue, 0);
          setTotalScholarship(total);
          setScholarshipCurrency(activeResponse.data[0].currency || 'USD');
          setScholarshipLabel('received');
        } else {
          setTotalScholarship(0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch scholarship total:', err);
    }
  }, [token]);

  // Auto-refresh when screen gains focus
  useFocusEffect(
    useCallback(() => {
      setRefreshTrigger(prev => prev + 1);
      fetchTotalScholarship();
    }, [fetchTotalScholarship])
  );

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleTabPress = useCallback((index: number) => {
    isTabPressScroll.current = true;
    setActiveTabIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    animateIndicator(index);
  }, [width]);

  const animateIndicator = useCallback((index: number) => {
    const tabWidth = (width - 32) / TABS.length;
    Animated.spring(tabIndicatorPosition, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  }, [width, tabIndicatorPosition]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Skip if this scroll is from a tab press (let the animation handle it)
    if (isTabPressScroll.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const tabWidth = (width - 32) / TABS.length;
    const progress = offsetX / width;

    // Update indicator position based on scroll
    tabIndicatorPosition.setValue(progress * tabWidth);
  }, [width, tabIndicatorPosition]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Reset the tab press flag
    isTabPressScroll.current = false;

    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== activeTabIndex && newIndex >= 0 && newIndex < TABS.length) {
      setActiveTabIndex(newIndex);
    }
  }, [width, activeTabIndex]);

  const topPadding = isDesktop ? 16 : Math.max(insets.top, Platform.OS === 'ios' ? 47 : 24);
  const tabWidth = (width - 32) / TABS.length;

  // Header component for Active tab to show recommended offer
  const ActiveTabHeader = useCallback(() => (
    <RecommendedOfferCard refreshTrigger={refreshTrigger} />
  ), [refreshTrigger]);

  return (
    <Box className="flex-1 bg-background-0">
      {/* Sticky Header */}
      <Box
        className="bg-background-0"
        style={{
          paddingTop: topPadding,
          zIndex: 10,
        }}
      >
        <Box
          className="px-4 py-3"
          style={{
            maxWidth: isDesktop ? 1200 : undefined,
            alignSelf: isDesktop ? 'center' : undefined,
            width: '100%',
          }}
        >
          {/* Top Row: Back, Logo, Scholarship Total, Profile */}
          <Box className="flex-row items-center justify-between mb-3">
            <Box className="flex-row items-center">
              {!isDesktop && (
                <Pressable
                  onPress={() => router.back()}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Box className="w-9 h-9 items-center justify-center mr-1">
                    <ChevronLeft
                      size={22}
                      strokeWidth={2.5}
                      color={iconColors.primary}
                    />
                  </Box>
                </Pressable>
              )}

              {/* Logo */}
              <Box className="flex-row items-center">
                <Image
                  source={require('@/assets/images/icons/app-icon-transparent-bg.png')}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
                <Text className="text-lg font-inter-black text-typography-900 ml-2 tracking-tight">
                  Offers
                </Text>
              </Box>
            </Box>

            <HStack className="items-center" space="md">
              {/* Total Scholarship Badge */}
              {totalScholarship > 0 && (
                <Box
                  className={`flex-row items-center px-3 py-1.5 rounded-full ${
                    scholarshipLabel === 'accepted' ? 'bg-success-100' : 'bg-primary-100'
                  }`}
                >
                  <Award size={16} color={scholarshipLabel === 'accepted' ? '#16a34a' : '#6366f1'} />
                  <Text
                    className={`font-inter-bold text-sm ml-1.5 ${
                      scholarshipLabel === 'accepted' ? 'text-success-700' : 'text-primary-700'
                    }`}
                  >
                    {formatCurrency(totalScholarship, scholarshipCurrency)}
                  </Text>
                </Box>
              )}

              {!isDesktop && <UserAvatar name={user?.name || 'User'} />}
            </HStack>
          </Box>

          {/* Search Bar */}
          <Box
            className={`flex-row items-center rounded-xl px-3 py-2 border ${
              isSearchFocused
                ? 'bg-background-50 border-primary-400'
                : 'bg-background-50 border-transparent'
            }`}
            style={Platform.OS === 'web' ? { outlineStyle: 'none' } : undefined}
          >
            <Search size={18} color={iconColors.muted} />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search offers..."
              placeholderTextColor={iconColors.muted}
              style={[
                {
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  fontFamily: 'Inter-Regular',
                  color: isDark ? 'rgb(245, 245, 245)' : 'rgb(38, 38, 39)',
                  paddingVertical: Platform.OS === 'ios' ? 6 : 4,
                },
                Platform.OS === 'web' ? { outlineStyle: 'none' } : {},
              ]}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch} style={{ padding: 4 }}>
                <X size={16} color={iconColors.muted} />
              </Pressable>
            )}
          </Box>

          {/* Tab Bar */}
          <Box className="mt-4 relative">
            <HStack>
              {TABS.map((tab, index) => {
                const isActive = activeTabIndex === index;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => handleTabPress(index)}
                    style={{ flex: 1 }}
                  >
                    <Box className="items-center py-2">
                      <Text
                        className={`text-sm font-inter-semibold ${
                          isActive ? 'text-primary-500' : 'text-typography-500'
                        }`}
                      >
                        {tab.label}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </HStack>

            {/* Base line */}
            <Box
              className="absolute left-0 right-0 bg-outline-100"
              style={{ bottom: 0, height: 1, marginHorizontal: -16 }}
            />

            {/* Animated Tab Indicator - on top of base line */}
            <Animated.View
              style={{
                position: 'absolute',
                bottom: -1,
                left: 0,
                width: tabWidth,
                height: 3,
                backgroundColor: isDark ? 'rgb(119, 134, 248)' : 'rgb(81, 100, 246)',
                borderRadius: 1.5,
                transform: [{ translateX: tabIndicatorPosition }],
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Swipable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{
          width: width * TABS.length,
        }}
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
      >
        {/* Active Tab */}
        <Box style={{ width, flex: 1 }}>
          <Box
            className="flex-1"
            style={{
              maxWidth: isDesktop ? 1200 : undefined,
              alignSelf: isDesktop ? 'center' : undefined,
              width: '100%',
            }}
          >
            <OfferListSection
              status="active"
              searchQuery={searchQuery}
              refreshTrigger={refreshTrigger}
              numColumns={isDesktop ? 4 : 2}
              ListHeaderComponent={<ActiveTabHeader />}
            />
          </Box>
        </Box>

        {/* Accepted Tab */}
        <Box style={{ width, flex: 1 }}>
          <Box
            className="flex-1"
            style={{
              maxWidth: isDesktop ? 1200 : undefined,
              alignSelf: isDesktop ? 'center' : undefined,
              width: '100%',
            }}
          >
            <OfferListSection
              status="accepted"
              searchQuery={searchQuery}
              refreshTrigger={refreshTrigger}
              numColumns={isDesktop ? 4 : 2}
            />
          </Box>
        </Box>

        {/* Rejected Tab */}
        <Box style={{ width, flex: 1 }}>
          <Box
            className="flex-1"
            style={{
              maxWidth: isDesktop ? 1200 : undefined,
              alignSelf: isDesktop ? 'center' : undefined,
              width: '100%',
            }}
          >
            <OfferListSection
              status="rejected"
              searchQuery={searchQuery}
              refreshTrigger={refreshTrigger}
              numColumns={isDesktop ? 4 : 2}
            />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
