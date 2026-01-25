'use client';
import React, { useState, useEffect } from 'react';
import { Image, Pressable, useColorScheme, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { LinearGradient } from 'expo-linear-gradient';
import { Skeleton } from '@/components/ui/Skeleton';
import { ScholarshipOffer, offersApi } from '@/src/api/offers.api';
import { Calendar, Star, ArrowRight } from '@/components/navigation/icons';
import { useAuth } from '@/src/contexts/AuthContext';
import config from '@/src/config';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

// Fallback images for colleges without cover images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
];

// Format currency
function formatCurrency(value: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Get college initial
function getCollegeInitial(name?: string): string {
  if (!name) return 'C';
  return name.charAt(0).toUpperCase();
}

interface RecommendedOfferCardProps {
  refreshTrigger?: number;
}

export function RecommendedOfferCard({ refreshTrigger }: RecommendedOfferCardProps) {
  const { token } = useAuth();
  const [offer, setOffer] = useState<ScholarshipOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Animation values
  const shimmerPosition = useSharedValue(-1);
  const glowOpacity = useSharedValue(0.3);
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    // Shimmer animation - sweeps across the card
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );

    // Glow pulse animation
    glowOpacity.value = withRepeat(
      withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Badge subtle pulse
    badgeScale.value = withRepeat(
      withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(shimmerPosition.value, [-1, 1], [-400, 400]) },
        { skewX: '-20deg' },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: badgeScale.value }],
    };
  });

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await offersApi.getRecommendedOffer(token);
        setOffer(response.data);
      } catch (err) {
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [token, refreshTrigger]);

  const handlePress = () => {
    if (offer) {
      router.push(`/(app)/offers/${offer._id}`);
    }
  };

  if (loading) {
    return (
      <Box style={{ marginBottom: 16 }}>
        <Box className="rounded-2xl overflow-hidden" style={{ height: 200 }}>
          <Skeleton width="100%" height={200} borderRadius={16} />
        </Box>
      </Box>
    );
  }

  if (!offer) {
    return null;
  }

  // Build cover image URL - use offer ID to get consistent fallback
  const collegeCoverImage = offer.college?.coverImage;
  const hasCoverImage = collegeCoverImage && collegeCoverImage.length > 10;
  const fallbackIndex = offer._id ? offer._id.charCodeAt(0) % FALLBACK_IMAGES.length : 0;
  const coverImageUrl = hasCoverImage
    ? (collegeCoverImage.startsWith('http')
        ? collegeCoverImage
        : `${config.apiUrl.replace('/api', '')}${collegeCoverImage}`)
    : FALLBACK_IMAGES[fallbackIndex];

  // Build logo URL
  const logoUrl = offer.college?.logo
    ? offer.college.logo.startsWith('http')
      ? offer.college.logo
      : `${config.apiUrl.replace('/api', '')}${offer.college.logo}`
    : null;

  const showCoverGradient = coverError && !hasCoverImage;
  const showLogoFallback = !logoUrl || logoError;

  return (
    <Box style={{ marginBottom: 16 }}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
      >
        <Box
          className="rounded-2xl overflow-hidden"
          style={{ height: 200 }}
        >
          {/* Full background image */}
          {showCoverGradient ? (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <Image
              source={{ uri: coverImageUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onError={() => setCoverError(true)}
            />
          )}

          {/* Dark gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Animated shimmer effect */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 150,
                backgroundColor: 'transparent',
              },
              shimmerStyle,
            ]}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255,255,255,0.15)',
                'rgba(255,255,255,0.25)',
                'rgba(255,255,255,0.15)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>

          {/* Animated border glow */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: '#f59e0b',
              },
              glowStyle,
            ]}
          />

          {/* Content overlay */}
          <Box className="absolute inset-0 p-4 justify-between">
            {/* Top row - badges */}
            <HStack className="justify-between items-start">
              {/* Featured badge with animation */}
              <Animated.View style={badgeAnimatedStyle}>
                <Box
                  className="flex-row items-center px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.95)' }}
                >
                  <Star size={12} color="#ffffff" fill="#ffffff" />
                  <Text className="text-white text-xs font-inter-bold ml-1.5">
                    Featured Offer
                  </Text>
                </Box>
              </Animated.View>

              {/* Value badge */}
              <Box
                className="px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.95)' }}
              >
                <Text className="text-white text-sm font-inter-black">
                  {formatCurrency(offer.totalValue, offer.currency)}
                </Text>
              </Box>
            </HStack>

            {/* Bottom content */}
            <Box>
              {/* College info row */}
              <HStack className="items-center mb-2">
                {/* Logo */}
                {showLogoFallback ? (
                  <Box
                    className="rounded-full overflow-hidden items-center justify-center mr-2"
                    style={{ width: 32, height: 32 }}
                  >
                    <LinearGradient
                      colors={['#3b82f6', '#1e40af']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Text className="text-white font-inter-bold text-sm">
                      {getCollegeInitial(offer.college?.name)}
                    </Text>
                  </Box>
                ) : (
                  <Box
                    className="rounded-full bg-white p-0.5 mr-2"
                    style={{ width: 32, height: 32 }}
                  >
                    <Image
                      source={{ uri: logoUrl! }}
                      style={{ width: '100%', height: '100%', borderRadius: 14 }}
                      resizeMode="cover"
                      onError={() => setLogoError(true)}
                    />
                  </Box>
                )}
                <Text className="text-white/80 text-sm font-inter-medium flex-1" numberOfLines={1}>
                  {offer.college?.name || 'Unknown College'}
                </Text>
              </HStack>

              {/* Title */}
              <Text
                className="text-white font-inter-bold text-xl leading-tight mb-2"
                numberOfLines={2}
              >
                {offer.title}
              </Text>

              {/* Bottom row - expiry and CTA */}
              <HStack className="items-center justify-between">
                {offer.expiryDate && (
                  <HStack className="items-center">
                    <Calendar size={14} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 text-xs font-inter-medium ml-1.5">
                      Expires {formatDate(offer.expiryDate)}
                    </Text>
                  </HStack>
                )}

                <HStack className="items-center">
                  <Text className="text-white text-sm font-inter-semibold mr-1">
                    View Details
                  </Text>
                  <ArrowRight size={16} color="white" />
                </HStack>
              </HStack>
            </Box>
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
}

export default RecommendedOfferCard;
