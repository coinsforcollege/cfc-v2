'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Image,
  Pressable,
  Animated,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heart, Globe } from '@/components/navigation/icons';
import { collegesApi, College } from '@/src/api/colleges.api';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 250;
const SPACING = 12;

// Theme colors for icons (from config.ts)
const THEME_COLORS = {
  light: {
    primary: 'rgb(81, 100, 246)',    // primary-500 light
    accent: 'rgb(163, 163, 163)',    // typography-400 light
    indicator: 'rgb(81, 100, 246)',  // primary-500
  },
  dark: {
    primary: 'rgb(119, 134, 248)',   // primary-500 dark
    accent: 'rgb(140, 140, 140)',    // typography-400 dark
    indicator: 'rgb(119, 134, 248)', // primary-500
  },
};

// Fallback images for colleges without cover images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544531696-b9481c8df52c?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1592280771884-f3da7e189874?w=400&h=600&fit=crop',
];

interface ReelCardProps {
  college: College;
  index: number;
  onPress: () => void;
}

function ReelCard({ college, index, onPress }: ReelCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isLiked, setIsLiked] = useState(false);

  // Use cover image or fallback
  const coverImage = college.coverImage && college.coverImage.length > 10
    ? college.coverImage
    : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <Box
        className="rounded-3xl overflow-hidden mr-3 relative bg-background-900 shadow-hard-2"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <Image
          source={{ uri: coverImage }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.4, 1]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
          }}
        />

        {/* Rank Badge */}
        <Box
          className="absolute rounded-md px-1.5 py-1"
          style={{
            top: 10,
            left: 10,
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            #{index + 1}
          </Text>
        </Box>

        {/* Country Badge */}
        <Box
          className="absolute rounded-md px-1.5 py-1"
          style={{
            top: 10,
            right: 10,
            backgroundColor: 'rgb(81, 100, 246)',
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {college.country.substring(0, 3)}
          </Text>
        </Box>

        {/* College Info */}
        <Box
          className="absolute left-2.5 right-2.5"
          style={{ bottom: 44 }}
        >
          {/* Logo Circle */}
          <Box
            className="w-7 h-7 rounded-full p-0.5 mb-1.5"
            style={{ backgroundColor: 'white' }}
          >
            <Box
              className="flex-1 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgb(81, 100, 246)' }}
            >
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 12 }}>
                {college.name.charAt(0)}
              </Text>
            </Box>
          </Box>

          <Text
            style={{ color: 'white', fontWeight: '700', fontSize: 14, lineHeight: 18, marginBottom: 2 }}
            numberOfLines={2}
          >
            {college.shortName || college.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }} numberOfLines={1}>
            {college.city || college.country}
          </Text>
        </Box>

        {/* Bottom Actions */}
        <Box
          className="absolute left-2.5 right-2.5 flex-row justify-between items-center"
          style={{ bottom: 10 }}
        >
          <Box className="flex-row items-center">
            <Globe size={10} color="white" />
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 10, marginLeft: 4 }}>
              {college.type}
            </Text>
          </Box>

          <Pressable
            onPress={() => setIsLiked(!isLiked)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Box
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: isLiked ? '#ef4444' : 'rgba(255,255,255,0.2)' }}
            >
              <Heart
                size={12}
                color="white"
                fill={isLiked ? 'white' : 'none'}
                strokeWidth={2.5}
              />
            </Box>
          </Pressable>
        </Box>
      </Box>
    </Pressable>
  );
}

export function FeaturedReelCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

  const fetchFeaturedColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await collegesApi.getFeatured(10);
      if (response.success && response.data) {
        setColleges(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load featured colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = useCallback((college: College) => {
    router.push(`/(app)/colleges/${college._id}`);
  }, []);

  if (loading) {
    return (
      <Box className="h-[270px] items-center justify-center bg-background-0">
        <ActivityIndicator size="small" color={themeColors.indicator} />
      </Box>
    );
  }

  if (error || colleges.length === 0) {
    return null;
  }

  return (
    <Box className="pt-4 pb-6 bg-background-0">
      {/* Section Header */}
      <Box className="px-4 mb-3">
        <Text className="text-typography-900 font-black text-lg tracking-tight">
          Featured Colleges
        </Text>
      </Box>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {colleges.map((college, index) => (
          <ReelCard
            key={college._id}
            college={college}
            index={index}
            onPress={() => handleCardPress(college)}
          />
        ))}
      </Animated.ScrollView>
    </Box>
  );
}

export default FeaturedReelCarousel;
