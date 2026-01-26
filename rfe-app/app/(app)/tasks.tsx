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
  InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { Search, ChevronLeft, X } from '@/components/navigation/icons';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { TaskListSection } from '@/components/tasks/TaskListSection';
import { SubmissionListSection } from '@/components/tasks/SubmissionListSection';
import { tasksApi, CategoryWithCount } from '@/src/api/tasks.api';
import { studentApi } from '@/src/api/student.api';
import { HugoAIFab } from '@/components/navigation';

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
  { key: 'in_review', label: 'In Review' },
  { key: 'completed', label: 'Completed' },
] as const;

type TabKey = typeof TABS[number]['key'];


export default function TasksScreen() {
  const { width } = useWindowDimensions();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Refs for scroll sync
  const scrollViewRef = useRef<ScrollView>(null);
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const isTabPressScroll = useRef(false);

  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;
  const [isReady, setIsReady] = useState(false);

  // Delay heavy content until after navigation animation completes
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => interaction.cancel();
  }, []);

  // Fetch categories and profile picture on mount
  useEffect(() => {
    fetchCategories();
    const fetchProfilePicture = async () => {
      if (!token) return;
      try {
        const response = await studentApi.getProfile(token);
        if (response.success) {
          setProfilePicture(response.data.profilePicture || null);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };
    fetchProfilePicture();
  }, [token]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await tasksApi.getCategories();
      setCategories(response.data);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

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

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const topPadding = isDesktop ? 16 : Math.max(insets.top, Platform.OS === 'ios' ? 47 : 24);
  const tabWidth = (width - 32) / TABS.length;

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
          {/* Top Row: Back, Logo, Profile */}
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
                  Tasks
                </Text>
              </Box>
            </Box>

            {!isDesktop && <UserAvatar name={user?.name || 'User'} profilePicture={profilePicture} size={36} />}
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
              placeholder="Search tasks..."
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

        {/* Category Chips - Outside swipable area */}
        <Box style={{ paddingTop: 12, paddingBottom: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {categoriesLoading ? (
              [...Array(6)].map((_, i) => (
                <Box key={i} style={{ marginRight: 8 }}>
                  <Skeleton width={80} height={36} borderRadius={18} />
                </Box>
              ))
            ) : (
              categories.map((category) => {
                const isSelected = selectedCategory === category._id;
                return (
                  <Pressable
                    key={category._id}
                    onPress={() => handleCategorySelect(category._id)}
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
                      <Text
                        className={`text-xs font-inter-semibold ${
                          isSelected ? 'text-typography-0' : 'text-typography-700'
                        }`}
                      >
                        {category.name}
                      </Text>
                      <Box
                        className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20' : 'bg-background-200'
                        }`}
                      >
                        <Text
                          className={`text-2xs font-inter-bold ${
                            isSelected ? 'text-typography-0' : 'text-typography-500'
                          }`}
                        >
                          {category.taskCount}
                        </Text>
                      </Box>
                    </Box>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </Box>
      </Box>

      {/* Swipable Content */}
      {isReady ? (
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
              <TaskListSection
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                numColumns={isDesktop ? 4 : 2}
              />
            </Box>
          </Box>

          {/* In Review Tab */}
          <Box style={{ width, flex: 1 }}>
            <SubmissionListSection type="pending" />
          </Box>

          {/* Completed Tab */}
          <Box style={{ width, flex: 1 }}>
            <SubmissionListSection type="completed" />
          </Box>
        </ScrollView>
      ) : (
        <Box className="flex-1" />
      )}

      {/* Hugo AI FAB */}
      <HugoAIFab />
    </Box>
  );
}
