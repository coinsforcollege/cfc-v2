'use client';
import React, { useState } from 'react';
import { Image, Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { LinearGradient } from 'expo-linear-gradient';
import { ScholarshipOffer } from '@/src/api/offers.api';
import { Calendar, MapPin } from '@/components/navigation/icons';
import config from '@/src/config';

// Fallback images for colleges without cover images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop',
];

interface OfferCardProps {
  offer: ScholarshipOffer;
  index: number;
}

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Get college initial
function getCollegeInitial(name?: string): string {
  if (!name) return 'C';
  return name.charAt(0).toUpperCase();
}

export function OfferCard({ offer, index }: OfferCardProps) {
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    router.push(`/(app)/offers/${offer._id}`);
  };

  // Build cover image URL - use college coverImage or fallback
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

  const showCoverGradient = coverError && !hasCoverImage;
  const showLogoFallback = !logoUrl || logoError;

  // Check if offer is expiring soon (within 7 days)
  const isExpiringSoon = offer.expiryDate &&
    new Date(offer.expiryDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
    new Date(offer.expiryDate).getTime() > Date.now();

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        flex: 1,
      })}
    >
      <Box
        className="bg-background-0 rounded-2xl overflow-hidden border border-outline-100"
        style={{ height: 200 }}
      >
        {/* Top section with cover image */}
        <Box className="relative" style={{ height: 90 }}>
          {showCoverGradient ? (
            <LinearGradient
              colors={['#3b82f6', '#1e40af']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-white/60 font-inter-black text-2xl">
                {getCollegeInitial(offer.college?.name)}
              </Text>
            </LinearGradient>
          ) : (
            <Image
              source={{ uri: coverImageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setCoverError(true)}
            />
          )}

          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            locations={[0.2, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
            }}
          />

          {/* Logo overlay */}
          {showLogoFallback ? (
            <Box
              className="absolute rounded-full overflow-hidden items-center justify-center"
              style={{ bottom: 8, left: 8, width: 28, height: 28 }}
            >
              <LinearGradient
                colors={['#3b82f6', '#1e40af']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              />
              <Text className="text-typography-0 font-inter-bold text-xs">
                {getCollegeInitial(offer.college?.name)}
              </Text>
            </Box>
          ) : (
            <Box
              className="absolute rounded-full bg-background-0 p-0.5"
              style={{ bottom: 8, left: 8, width: 28, height: 28 }}
            >
              <Image
                source={{ uri: logoUrl! }}
                style={{ width: '100%', height: '100%', borderRadius: 12 }}
                resizeMode="cover"
                onError={() => setLogoError(true)}
              />
            </Box>
          )}

          {/* Scholarship Value Badge */}
          <Box
            className="absolute bottom-2 right-2 px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.95)' }}
          >
            <Text className="text-white text-xs font-inter-bold">
              {formatCurrency(offer.totalValue, offer.currency)}
            </Text>
          </Box>

          {/* Recommended Badge */}
          {offer.isRecommended && (
            <Box
              className="absolute top-2 right-2 px-2 py-1 rounded-lg"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.95)' }}
            >
              <Text className="text-white text-2xs font-inter-semibold">
                Featured
              </Text>
            </Box>
          )}

          {/* Expiring Soon Badge */}
          {isExpiringSoon && !offer.isRecommended && (
            <Box
              className="absolute top-2 right-2 px-2 py-1 rounded-lg"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.95)' }}
            >
              <Text className="text-white text-2xs font-inter-semibold">
                Expiring Soon
              </Text>
            </Box>
          )}

          {/* Country Badge */}
          {offer.college?.country && (
            <Box
              className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary-500"
            >
              <Text className="text-typography-0 text-2xs font-inter-bold uppercase">
                {offer.college.country.length > 10
                  ? offer.college.country.substring(0, 3)
                  : offer.college.country.substring(0, 3)}
              </Text>
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box className="px-3 pt-2 pb-2 flex-1 justify-between">
          {/* Title */}
          <Text
            className="text-typography-900 font-inter-bold text-sm leading-tight"
            numberOfLines={2}
          >
            {offer.title}
          </Text>

          {/* College name */}
          <Text
            className="text-typography-500 text-xs font-inter-medium"
            numberOfLines={1}
          >
            {offer.college?.name || 'Unknown College'}
          </Text>

          {/* Bottom row: Expiry */}
          {offer.expiryDate && (
            <HStack className="items-center mt-auto">
              <Calendar size={12} color={isDark ? '#a1a1aa' : '#71717a'} />
              <Text className="text-2xs text-typography-500 ml-1">
                Expires {formatDate(offer.expiryDate)}
              </Text>
            </HStack>
          )}
        </Box>
      </Box>
    </Pressable>
  );
}

export default OfferCard;
