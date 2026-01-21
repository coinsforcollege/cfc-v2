'use client';
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Image,
  Dimensions,
  Pressable,
  Animated,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heart, Globe } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 150;
const CARD_HEIGHT = 250;
const SPACING = 12;

// Real college data with realistic images
const FEATURED_COLLEGES = [
  {
    _id: '1',
    name: 'Stanford University',
    shortName: 'Stanford',
    country: 'USA',
    city: 'Palo Alto',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '2',
    name: 'Harvard University',
    shortName: 'Harvard',
    country: 'USA',
    city: 'Cambridge',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '3',
    name: 'MIT',
    shortName: 'MIT',
    country: 'USA',
    city: 'Cambridge',
    coverImage: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '4',
    name: 'University of Oxford',
    shortName: 'Oxford',
    country: 'UK',
    city: 'Oxford',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '5',
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    country: 'UK',
    city: 'Cambridge',
    coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '6',
    name: 'University of Toronto',
    shortName: 'U of T',
    country: 'Canada',
    city: 'Toronto',
    coverImage: 'https://images.unsplash.com/photo-1544531696-b9481c8df52c?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '7',
    name: 'University of Melbourne',
    shortName: 'Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '8',
    name: 'ETH Zurich',
    shortName: 'ETH',
    country: 'Germany',
    city: 'Zurich',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '9',
    name: 'National University of Singapore',
    shortName: 'NUS',
    country: 'Singapore',
    city: 'Singapore',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=600&fit=crop',
    type: 'University',
  },
  {
    _id: '10',
    name: 'University of Edinburgh',
    shortName: 'Edinburgh',
    country: 'UK',
    city: 'Edinburgh',
    coverImage: 'https://images.unsplash.com/photo-1592280771884-f3da7e189874?w=400&h=600&fit=crop',
    type: 'University',
  },
];

// Accent colors for each card
const CARD_ACCENTS = [
  ['#6366f1', '#8b5cf6'],
  ['#ec4899', '#f43f5e'],
  ['#14b8a6', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#8b5cf6', '#d946ef'],
  ['#10b981', '#14b8a6'],
  ['#3b82f6', '#06b6d4'],
  ['#f97316', '#ea580c'],
  ['#06b6d4', '#0ea5e9'],
  ['#84cc16', '#22c55e'],
];

interface FeaturedReelCarouselProps {
  colleges?: typeof FEATURED_COLLEGES;
}

interface ReelCardProps {
  college: typeof FEATURED_COLLEGES[0];
  index: number;
  onPress: () => void;
}

function ReelCard({ college, index, onPress }: ReelCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isLiked, setIsLiked] = useState(false);
  
  const interestedCount = React.useMemo(() => {
    return Math.floor(Math.random() * 5000) + 1200 + (index * 500);
  }, [index]);
  
  const accentColors = CARD_ACCENTS[index % CARD_ACCENTS.length];
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <Box
        className="rounded-[20px] overflow-hidden mr-3 relative"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          shadowColor: isDark ? '#000' : accentColors[0],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.5 : 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Image
          source={{ uri: college.coverImage }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.4, 1]}
          className="absolute bottom-0 left-0 right-0 h-[70%]"
        />
        
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 3,
          }}
        >
          <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
            #{index + 1}
          </Text>
        </View>
        
        <View
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: accentColors[0],
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 3,
          }}
        >
          <Text className="text-white text-[10px] font-bold uppercase tracking-wide">
            {college.country.substring(0, 3)}
          </Text>
        </View>
        
        <View
          style={{
            position: 'absolute',
            bottom: 44,
            left: 10,
            right: 10,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'white',
              padding: 2,
              marginBottom: 6,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 12,
                backgroundColor: accentColors[0],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text className="text-white font-black text-xs">
                {college.name.charAt(0)}
              </Text>
            </View>
          </View>
          
          <Text
            className="text-white font-bold text-sm leading-tight mb-0.5"
            numberOfLines={2}
          >
            {college.name}
          </Text>
          <Text className="text-white/70 text-[9px]" numberOfLines={1}>
            {college.city}
          </Text>
        </View>
        
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View className="flex-row items-center">
            <Globe size={10} color="white" />
            <Text className="text-white font-semibold text-[10px] ml-1">
              {(interestedCount / 1000).toFixed(1)}k
            </Text>
          </View>
          
          <Pressable
            onPress={() => setIsLiked(!isLiked)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: isLiked ? '#ef4444' : 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart
                size={12}
                color="white"
                fill={isLiked ? 'white' : 'none'}
                strokeWidth={2.5}
              />
            </View>
          </Pressable>
        </View>
      </Box>
    </Pressable>
  );
}

export function FeaturedReelCarousel({ colleges = FEATURED_COLLEGES }: FeaturedReelCarouselProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const handleCardPress = useCallback((college: typeof FEATURED_COLLEGES[0]) => {
    router.push(`/(app)/colleges/${college._id}`);
  }, []);
  
  return (
    <Box className="mb-4">
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
