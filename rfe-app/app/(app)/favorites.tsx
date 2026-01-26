import React, { useState, useCallback, useRef } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  Image,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { studentApi, FollowedCollege, InterestedCollege } from '@/src/api/student.api';
import config from '@/src/config';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Heart,
  Star,
  MapPin,
} from 'lucide-react-native';

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

const TABS = [
  { key: 'following', label: 'Following', icon: Heart },
  { key: 'shortlisted', label: 'Shortlisted', icon: Star },
] as const;

type TabKey = typeof TABS[number]['key'];

// Fallback images for colleges without cover
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop',
];

// College Card Component
function CollegeCard({
  college,
  type,
  onPress,
  index,
}: {
  college: FollowedCollege | InterestedCollege;
  type: 'following' | 'shortlisted';
  onPress: () => void;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const collegeData = college.college;
  const dateAdded = type === 'following'
    ? (college as FollowedCollege).followedAt
    : (college as InterestedCollege).interestedAt;

  const getCoverUrl = () => {
    if (imageError) return null;
    if (collegeData.coverImage && collegeData.coverImage.length > 10) {
      if (collegeData.coverImage.startsWith('http')) return collegeData.coverImage;
      const baseUrl = config.apiUrl.replace('/api', '');
      return `${baseUrl}${collegeData.coverImage}`;
    }
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  const getLogoUrl = () => {
    if (logoError || !collegeData.logo || collegeData.logo.length <= 5) return null;
    if (collegeData.logo.startsWith('http')) return collegeData.logo;
    const baseUrl = config.apiUrl.replace('/api', '');
    return `${baseUrl}${collegeData.logo}`;
  };

  const coverUrl = getCoverUrl();
  const logoUrl = getLogoUrl();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Box className="bg-background-0 rounded-2xl overflow-hidden border border-outline-100 shadow-soft-2">
        {/* Cover Image */}
        <Box className="relative" style={{ height: 140 }}>
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <LinearGradient
              colors={type === 'following' ? ['#ef4444', '#dc2626'] : ['#f59e0b', '#d97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-white/80 font-inter-black text-3xl tracking-wider">
                {collegeData.name.charAt(0)}
              </Text>
            </LinearGradient>
          )}

          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            locations={[0.3, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
            }}
          />

          {/* Type badge */}
          <Box
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full flex-row items-center ${
              type === 'following' ? 'bg-red-500' : 'bg-amber-500'
            }`}
            style={{ gap: 4 }}
          >
            {type === 'following' ? (
              <Heart size={12} color="#fff" fill="#fff" />
            ) : (
              <Star size={12} color="#fff" fill="#fff" />
            )}
            <Text className="text-white text-xs font-inter-bold">
              {type === 'following' ? 'Following' : 'Shortlisted'}
            </Text>
          </Box>

          {/* Logo */}
          <Box
            className="absolute rounded-full bg-background-0 p-1 shadow-soft-3"
            style={{ bottom: -20, left: 16, width: 48, height: 48 }}
          >
            {logoUrl ? (
              <Image
                source={{ uri: logoUrl }}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}
                resizeMode="cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="text-white font-inter-bold text-lg">
                  {collegeData.name.charAt(0)}
                </Text>
              </LinearGradient>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Box className="px-4 pt-6 pb-4">
          <Text className="text-typography-900 text-lg font-inter-bold" numberOfLines={1}>
            {collegeData.name}
          </Text>
          <HStack className="items-center mt-1" space="xs">
            <MapPin size={14} color="#6b7280" />
            <Text className="text-typography-500 text-sm font-inter-regular" numberOfLines={1}>
              {collegeData.city ? `${collegeData.city}, ${collegeData.country}` : collegeData.country}
            </Text>
          </HStack>
          <Text className="text-typography-400 text-xs font-inter-regular mt-2">
            Added {new Date(dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}

// Empty State Component
function EmptyState({ type }: { type: TabKey }) {
  const Icon = type === 'following' ? Heart : Star;
  const color = type === 'following' ? '#ef4444' : '#f59e0b';
  const bgColor = type === 'following' ? 'bg-error-50' : 'bg-warning-50';
  const message = type === 'following'
    ? "You haven't followed any colleges yet"
    : "You haven't shortlisted any colleges yet";

  return (
    <VStack className="flex-1 items-center justify-center py-20">
      <Box className={`w-20 h-20 rounded-full ${bgColor} items-center justify-center mb-4`}>
        <Icon size={36} color={color} />
      </Box>
      <Text className="text-typography-500 text-base font-inter-medium text-center px-8">
        {message}
      </Text>
      <Pressable
        onPress={() => router.push('/(app)/colleges')}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        className="mt-4"
      >
        <Box className="bg-primary-500 px-6 py-3 rounded-xl">
          <Text className="text-typography-0 text-sm font-inter-bold">
            Browse Colleges
          </Text>
        </Box>
      </Pressable>
    </VStack>
  );
}

export default function FavoritesScreen() {
  const { width } = useWindowDimensions();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [loading, setLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [followedColleges, setFollowedColleges] = useState<FollowedCollege[]>([]);
  const [interestedColleges, setInterestedColleges] = useState<InterestedCollege[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const isTabPressScroll = useRef(false);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);
  const tabWidth = (width - 32) / TABS.length;

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await studentApi.getProfile(token);
      if (response.success) {
        setFollowedColleges(response.data.followedColleges || []);
        setInterestedColleges(response.data.interestedColleges || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Tab handling
  const handleTabPress = useCallback((index: number) => {
    isTabPressScroll.current = true;
    setActiveTabIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    animateIndicator(index);
  }, [width]);

  const animateIndicator = useCallback((index: number) => {
    Animated.spring(tabIndicatorPosition, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  }, [tabWidth, tabIndicatorPosition]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isTabPressScroll.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const progress = offsetX / width;
    tabIndicatorPosition.setValue(progress * tabWidth);
  }, [width, tabWidth, tabIndicatorPosition]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isTabPressScroll.current = false;

    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== activeTabIndex && newIndex >= 0 && newIndex < TABS.length) {
      setActiveTabIndex(newIndex);
    }
  }, [width, activeTabIndex]);

  const handleCollegePress = (collegeId: string) => {
    router.push(`/(app)/colleges/${collegeId}`);
  };

  if (loading) {
    return (
      <Box className="flex-1 bg-background-50 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      {/* Header */}
      <Box
        className="bg-background-50 border-b border-outline-100"
        style={{ paddingTop: topPadding }}
      >
        <HStack className="px-4 py-3 items-center">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Box className="w-10 h-10 items-center justify-center">
              <ChevronLeft size={24} strokeWidth={2.5} color={iconColors.primary} />
            </Box>
          </Pressable>
          <Text className="flex-1 text-center text-lg font-inter-bold text-typography-900">
            Favorites
          </Text>
          <Box className="w-10 h-10" />
        </HStack>

        {/* Tab Bar */}
        <Box className="px-4 relative">
          <HStack>
            {TABS.map((tab, index) => {
              const isActive = activeTabIndex === index;
              const Icon = tab.icon;
              const count = index === 0 ? followedColleges.length : interestedColleges.length;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => handleTabPress(index)}
                  style={{ flex: 1 }}
                >
                  <HStack className="items-center justify-center py-3" space="xs">
                    <Icon
                      size={16}
                      color={isActive ? '#6366f1' : iconColors.muted}
                      fill={isActive ? '#6366f1' : 'transparent'}
                    />
                    <Text
                      className={`text-sm font-inter-semibold ${
                        isActive ? 'text-primary-500' : 'text-typography-500'
                      }`}
                    >
                      {tab.label}
                    </Text>
                    <Box
                      className={`px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-primary-100' : 'bg-background-100'
                      }`}
                    >
                      <Text
                        className={`text-xs font-inter-bold ${
                          isActive ? 'text-primary-600' : 'text-typography-500'
                        }`}
                      >
                        {count}
                      </Text>
                    </Box>
                  </HStack>
                </Pressable>
              );
            })}
          </HStack>

          {/* Base line */}
          <Box
            className="absolute left-0 right-0 bg-outline-100"
            style={{ bottom: 0, height: 1 }}
          />

          {/* Animated Tab Indicator */}
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
        contentContainerStyle={{ width: width * TABS.length }}
        nestedScrollEnabled
      >
        {/* Following Tab */}
        <Box style={{ width, flex: 1 }}>
          {followedColleges.length > 0 ? (
            <FlatList
              data={followedColleges}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <CollegeCard
                  college={item}
                  type="following"
                  onPress={() => handleCollegePress(item.college._id)}
                  index={index}
                />
              )}
              contentContainerStyle={{
                padding: 16,
                gap: 12,
                paddingBottom: Math.max(insets.bottom, 40),
              }}
              ItemSeparatorComponent={() => <Box className="h-3" />}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState type="following" />
          )}
        </Box>

        {/* Shortlisted Tab */}
        <Box style={{ width, flex: 1 }}>
          {interestedColleges.length > 0 ? (
            <FlatList
              data={interestedColleges}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <CollegeCard
                  college={item}
                  type="shortlisted"
                  onPress={() => handleCollegePress(item.college._id)}
                  index={index}
                />
              )}
              contentContainerStyle={{
                padding: 16,
                gap: 12,
                paddingBottom: Math.max(insets.bottom, 40),
              }}
              ItemSeparatorComponent={() => <Box className="h-3" />}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState type="shortlisted" />
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
