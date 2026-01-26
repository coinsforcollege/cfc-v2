'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Image,
  Pressable,
  Animated,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { offersApi, ScholarshipOffer } from '@/src/api/offers.api';
import { collegesApi, College } from '@/src/api/colleges.api';
import { ChevronRight, Clock } from 'lucide-react-native';
import config from '@/src/config';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 250;
const SPACING = 12;

// Fallback images for colleges/offers without cover images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=600&fit=crop',
];

// Format currency helper
function formatCurrency(value: number, currency: string = 'USD'): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return value.toString();
}

// Format date
function formatExpiryDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Expired';
  if (diffDays === 1) return '1 day left';
  if (diffDays <= 7) return `${diffDays} days left`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SkeletonReelCard() {
  return (
    <Box
      className="rounded-3xl overflow-hidden mr-3 relative bg-background-100"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      }}
    >
      <Skeleton width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={24} />
    </Box>
  );
}

interface OfferReelCardProps {
  offer: ScholarshipOffer;
  index: number;
  onPress: () => void;
}

function OfferReelCard({ offer, index, onPress }: OfferReelCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Build cover image URL
  const collegeCoverImage = offer.college?.coverImage;
  const hasCoverImage = collegeCoverImage && collegeCoverImage.length > 10;
  const coverImageUrl = hasCoverImage
    ? (collegeCoverImage.startsWith('http')
        ? collegeCoverImage
        : `${config.apiUrl.replace('/api', '')}${collegeCoverImage}`)
    : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  // Build logo URL
  const logoUrl = offer.college?.logo
    ? offer.college.logo.startsWith('http')
      ? offer.college.logo
      : `${config.apiUrl.replace('/api', '')}${offer.college.logo}`
    : null;

  // Check if expiring soon (within 7 days)
  const isExpiringSoon = offer.expiryDate &&
    new Date(offer.expiryDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
    new Date(offer.expiryDate).getTime() > Date.now();

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
          source={{ uri: coverImageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.4, 1]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '75%',
          }}
        />

        {/* Top gradient for badges */}
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
          }}
        />

        {/* Expiry Badge - only show if expiring soon */}
        {isExpiringSoon && offer.expiryDate && (
          <Box
            className="absolute rounded-md px-1.5 py-1 flex-row items-center"
            style={{
              top: 10,
              left: 10,
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
            }}
          >
            <Clock size={10} color="white" />
            <Text style={{ color: 'white', fontSize: 8, fontFamily: 'Inter-Bold', marginLeft: 3 }}>
              {formatExpiryDate(offer.expiryDate)}
            </Text>
          </Box>
        )}

        {/* Scholarship Amount - Top Right */}
        <Box
          className="absolute rounded-xl px-2.5 py-1.5"
          style={{
            top: 10,
            right: 10,
            backgroundColor: 'rgba(16, 185, 129, 0.95)',
          }}
        >
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter-Black' }}>
            ${formatCurrency(offer.totalValue, offer.currency)}
          </Text>
        </Box>

        {/* Bottom Content */}
        <Box
          className="absolute left-2.5 right-2.5"
          style={{ bottom: 12 }}
        >
          {/* College Logo */}
          {logoUrl ? (
            <Box
              className="w-7 h-7 rounded-full mb-1.5 overflow-hidden"
              style={{ backgroundColor: 'white' }}
            >
              <Image
                source={{ uri: logoUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </Box>
          ) : (
            <Box
              className="w-7 h-7 rounded-full p-0.5 mb-1.5"
              style={{ backgroundColor: 'white' }}
            >
              <Box
                className="flex-1 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgb(81, 100, 246)' }}
              >
                <Text style={{ color: 'white', fontFamily: 'Inter-Black', fontSize: 12 }}>
                  {offer.college?.name?.charAt(0) || 'S'}
                </Text>
              </Box>
            </Box>
          )}

          {/* Offer Title */}
          <Text
            style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 13, lineHeight: 16, marginBottom: 2 }}
            numberOfLines={2}
          >
            {offer.title}
          </Text>

          {/* College Name */}
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }} numberOfLines={1}>
            {offer.college?.name || 'Scholarship Offer'}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}

interface CollegeFallbackCardProps {
  college: College;
  index: number;
  onPress: () => void;
}

function CollegeFallbackCard({ college, index, onPress }: CollegeFallbackCardProps) {
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
          <Text style={{ color: 'white', fontSize: 10, fontFamily: 'Inter-Bold', textTransform: 'uppercase' }}>
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
          <Text style={{ color: 'white', fontSize: 10, fontFamily: 'Inter-Bold', textTransform: 'uppercase' }}>
            {college.country.substring(0, 3)}
          </Text>
        </Box>

        {/* College Info */}
        <Box
          className="absolute left-2.5 right-2.5"
          style={{ bottom: 12 }}
        >
          <Box
            className="w-7 h-7 rounded-full p-0.5 mb-1.5"
            style={{ backgroundColor: 'white' }}
          >
            <Box
              className="flex-1 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgb(81, 100, 246)' }}
            >
              <Text style={{ color: 'white', fontFamily: 'Inter-Black', fontSize: 12 }}>
                {college.name.charAt(0)}
              </Text>
            </Box>
          </Box>

          <Text
            style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 14, lineHeight: 18, marginBottom: 2 }}
            numberOfLines={2}
          >
            {college.shortName || college.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }} numberOfLines={1}>
            {college.city || college.country}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}

interface OfferReelCarouselProps {
  onDark?: boolean;
}

export function OfferReelCarousel({ onDark = true }: OfferReelCarouselProps) {
  const { token } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [offers, setOffers] = useState<ScholarshipOffer[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingOffers, setShowingOffers] = useState(true);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Try to fetch active offers first
      const offersResponse = await offersApi.getOffers(token, { status: 'active', limit: 10 });

      if (offersResponse.success && offersResponse.data && offersResponse.data.length > 0) {
        setOffers(offersResponse.data);
        setShowingOffers(true);
      } else {
        // No offers, fetch featured colleges as fallback
        const collegesResponse = await collegesApi.getFeatured(10);
        if (collegesResponse.success && collegesResponse.data) {
          setColleges(collegesResponse.data);
          setShowingOffers(false);
        }
      }
    } catch (err: any) {
      console.error('Error fetching offer reel data:', err);
      // Try colleges as fallback on error
      try {
        const collegesResponse = await collegesApi.getFeatured(10);
        if (collegesResponse.success && collegesResponse.data) {
          setColleges(collegesResponse.data);
          setShowingOffers(false);
        }
      } catch (collegeErr) {
        console.error('Error fetching colleges fallback:', collegeErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfferPress = useCallback((offer: ScholarshipOffer) => {
    router.push(`/(app)/offers/${offer._id}`);
  }, []);

  const handleCollegePress = useCallback((college: College) => {
    router.push(`/(app)/colleges/${college._id}`);
  }, []);

  const hasContent = showingOffers ? offers.length > 0 : colleges.length > 0;

  if (loading) {
    return (
      <Box className="my-6 mb-8">
        <Box className="px-4 mb-3">
          <Skeleton width={140} height={22} borderRadius={4} />
        </Box>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 32 }}
          scrollEnabled={false}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonReelCard key={i} />
          ))}
        </ScrollView>
      </Box>
    );
  }

  if (!hasContent) {
    return null;
  }

  const sectionTitle = showingOffers ? 'Scholarship Offers' : 'Featured Colleges';
  const viewAllRoute = showingOffers ? '/(app)/offers' : '/(app)/colleges';

  return (
    <Box className="my-6 mb-8">
      {/* Section Header */}
      <HStack className="px-4 mb-3 items-center justify-between">
        <Text
          className={`font-inter-regular text-lg tracking-tight ${onDark ? 'text-white' : 'text-typography-900'}`}
        >
          {sectionTitle}
        </Text>
        <Pressable
          onPress={() => router.push(viewAllRoute as any)}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <HStack className="items-center">
            <Text className={`text-sm font-inter-bold uppercase tracking-wider ${onDark ? 'text-indigo-300' : 'text-primary-600'}`}>
              View All
            </Text>
            <ChevronRight size={16} color={onDark ? '#a5b4fc' : '#4f46e5'} />
          </HStack>
        </Pressable>
      </HStack>

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
        {showingOffers
          ? offers.map((offer, index) => (
              <OfferReelCard
                key={offer._id}
                offer={offer}
                index={index}
                onPress={() => handleOfferPress(offer)}
              />
            ))
          : colleges.map((college, index) => (
              <CollegeFallbackCard
                key={college._id}
                college={college}
                index={index}
                onPress={() => handleCollegePress(college)}
              />
            ))}
      </Animated.ScrollView>
    </Box>
  );
}

export default OfferReelCarousel;
