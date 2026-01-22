'use client';
import React, { useState, useCallback } from 'react';
import {
  Pressable,
  TextInput,
  useWindowDimensions,
  useColorScheme,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { Search, ChevronLeft, X } from '@/components/navigation/icons';
import { FeaturedReelCarousel } from '@/components/colleges/FeaturedReelCarousel';
import { CollegeListSection } from '@/components/colleges/CollegeListSection';

const TABLET_BREAKPOINT = 768;

// Theme colors for icons (from config.ts)
const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',      // typography-900 light
    secondary: 'rgb(115, 115, 115)', // typography-600 light
    muted: 'rgb(163, 163, 163)',     // typography-400 light
  },
  dark: {
    primary: 'rgb(245, 245, 245)',   // typography-900 dark
    secondary: 'rgb(212, 212, 212)', // typography-600 dark
    muted: 'rgb(140, 140, 140)',     // typography-400 dark
  },
};

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

export default function CollegesScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Get themed icon colors
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const topPadding = isDesktop ? 16 : Math.max(insets.top, Platform.OS === 'ios' ? 47 : 24);

  // Header component to pass to the list
  const ListHeader = useCallback(() => {
    if (searchQuery) return null;
    return <FeaturedReelCarousel />;
  }, [searchQuery]);

  return (
    <Box className="flex-1 bg-background-0">
      {/* Sticky Header */}
      <Box
        className="bg-background-0 border-b border-outline-100"
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
                  Colleges
                </Text>
              </Box>
            </Box>

            {!isDesktop && <UserAvatar name={user?.name || 'User'} />}
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
              placeholder="Search colleges, countries..."
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
        </Box>
      </Box>

      {/* Content - Single scrollable area */}
      <Box
        className="flex-1"
        style={{
          maxWidth: isDesktop ? 1200 : undefined,
          alignSelf: isDesktop ? 'center' : undefined,
          width: '100%',
        }}
      >
        <CollegeListSection
          searchQuery={searchQuery}
          numColumns={isDesktop ? 4 : 2}
          ListHeaderComponent={ListHeader}
        />
      </Box>
    </Box>
  );
}
