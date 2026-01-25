'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  X,
  Clock,
  Star,
  ExternalLink,
  School,
} from '@/components/navigation/icons';
import { offersApi, ScholarshipOffer, SingleOfferResponse } from '@/src/api/offers.api';
import config from '@/src/config';
import { useAuth } from '@/src/contexts/AuthContext';
import { AcceptOfferSheet } from '@/components/offers/AcceptOfferSheet';

const TABLET_BREAKPOINT = 768;

// Fallback images for colleges without cover images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
];

// Theme colors
const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
    accent: 'rgb(99, 102, 241)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
    accent: 'rgb(129, 140, 248)',
  },
};

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

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-typography-900 font-inter-bold text-base mb-3">
      {title}
    </Text>
  );
}

// Stat Card Component
function StatCard({ value, label, icon: Icon, iconColor }: {
  value: string;
  label: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
}) {
  return (
    <VStack className="flex-1 items-center py-3">
      {Icon && <Icon size={20} color={iconColor} style={{ marginBottom: 4 }} />}
      <Text className="text-typography-900 font-inter-bold text-lg">
        {value}
      </Text>
      <Text className="text-typography-500 text-xs text-center mt-1">
        {label}
      </Text>
    </VStack>
  );
}

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;

  const { token } = useAuth();

  const [offer, setOffer] = useState<ScholarshipOffer | null>(null);
  const [existingResponse, setExistingResponse] = useState<{ status: string; respondedAt: string } | null>(null);
  const [isEligible, setIsEligible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [showAcceptSheet, setShowAcceptSheet] = useState(false);
  const [expandedLetter, setExpandedLetter] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  useEffect(() => {
    if (id && token) {
      fetchOffer();
    }
  }, [id, token]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await offersApi.getOfferDetails(token!, id!);
      setOffer(response.data.offer);
      setExistingResponse(response.data.existingResponse);
      setIsEligible(response.data.isEligible);
    } catch (err: any) {
      setError(err.message || 'Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = useCallback(() => {
    if (!isEligible) {
      Alert.alert('Not Eligible', 'You are not eligible for this scholarship offer.');
      return;
    }
    setShowAcceptSheet(true);
  }, [isEligible]);

  const handleReject = useCallback(async () => {
    Alert.alert(
      'Decline Offer',
      'Are you sure you want to decline this scholarship offer? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await offersApi.rejectOffer(token!, id!);
              Alert.alert('Offer Declined', 'You have declined this scholarship offer.');
              fetchOffer();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to decline offer');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  }, [token, id]);

  const handleAcceptSuccess = useCallback(() => {
    Alert.alert('Success', 'You have accepted this scholarship offer!');
    fetchOffer();
  }, []);

  const openCollegeWebsite = useCallback(() => {
    if (offer?.college?.website) {
      const url = offer.college.website.startsWith('http')
        ? offer.college.website
        : `https://${offer.college.website}`;
      Linking.openURL(url);
    }
  }, [offer]);

  if (loading) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <ActivityIndicator size="large" color={iconColors.accent} />
      </Box>
    );
  }

  if (error || !offer) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center px-6">
        <School size={64} color={iconColors.muted} />
        <Text className="text-typography-900 text-lg font-inter-semibold mt-4">
          Offer not found
        </Text>
        <Text className="text-typography-500 text-sm text-center mt-2">
          {error || 'The offer you are looking for does not exist.'}
        </Text>
        <Button className="mt-6" onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  // Build cover image URL
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

  // Format expiry date
  const expiryDate = offer.expiryDate ? new Date(offer.expiryDate) : null;
  const isExpired = expiryDate && expiryDate < new Date();
  const formattedExpiry = expiryDate ? formatDate(offer.expiryDate!) : null;

  // Response status
  const responseStatus = existingResponse?.status;
  const hasResponded = responseStatus === 'accepted' || responseStatus === 'rejected';

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Cover Image Header */}
        <Box className="relative" style={{ height: isDesktop ? 280 : 220 }}>
          {showCoverGradient ? (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%' }}
            />
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
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.3, 1]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={24} color="white" strokeWidth={2.5} />
          </Pressable>

          {/* Featured Badge */}
          {offer.isRecommended && (
            <Box
              style={{
                position: 'absolute',
                top: insets.top + 8,
                right: 16,
              }}
            >
              <Box
                className="flex-row items-center px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.95)' }}
              >
                <Star size={14} color="#ffffff" fill="#ffffff" />
                <Text className="text-white text-xs font-inter-bold ml-1.5">
                  Featured
                </Text>
              </Box>
            </Box>
          )}

          {/* Title & Value on Cover */}
          <Box
            className="absolute left-0 right-0 px-4"
            style={{ bottom: 16 }}
          >
            {/* College Logo & Name */}
            <HStack className="items-center mb-2">
              {showLogoFallback ? (
                <Box
                  className="rounded-full overflow-hidden items-center justify-center mr-2"
                  style={{ width: 36, height: 36 }}
                >
                  <LinearGradient
                    colors={['#3b82f6', '#1e40af']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                  />
                  <Text className="text-white font-inter-bold text-sm">
                    {getCollegeInitial(offer.college?.name)}
                  </Text>
                </Box>
              ) : (
                <Box
                  className="rounded-full bg-white p-0.5 mr-2"
                  style={{ width: 36, height: 36 }}
                >
                  <Image
                    source={{ uri: logoUrl! }}
                    style={{ width: '100%', height: '100%', borderRadius: 16 }}
                    resizeMode="cover"
                    onError={() => setLogoError(true)}
                  />
                </Box>
              )}
              <Text className="text-white/90 text-sm font-inter-semibold flex-1" numberOfLines={1}>
                {offer.college?.name || 'Unknown College'}
              </Text>
            </HStack>

            {/* Title */}
            <Text
              className="text-white font-inter-black text-xl leading-tight mb-2"
              numberOfLines={3}
              style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
            >
              {offer.title}
            </Text>

            {/* Value Badge */}
            <HStack className="items-center">
              <Box className="bg-success-500 px-3 py-1.5 rounded-full">
                <Text className="text-white font-inter-black text-base">
                  {formatCurrency(offer.totalValue, offer.currency)}
                </Text>
              </Box>
            </HStack>
          </Box>
        </Box>

        {/* Content */}
        <Box className={`px-4 ${isDesktop ? 'max-w-[800px] self-center w-full' : ''}`}>
          {/* Quick Stats Row */}
          <HStack className="bg-background-100 rounded-2xl mt-4">
            {offer.college?.country && (
              <>
                <StatCard
                  value={offer.college.country}
                  label="Location"
                  icon={MapPin}
                  iconColor={iconColors.accent}
                />
                <Box className="w-px bg-outline-200 my-3" />
              </>
            )}
            {formattedExpiry && (
              <StatCard
                value={formattedExpiry}
                label={isExpired ? 'Expired' : 'Deadline'}
                icon={Calendar}
                iconColor={isExpired ? '#ef4444' : '#f59e0b'}
              />
            )}
            {offer.college?.website && (
              <>
                <Box className="w-px bg-outline-200 my-3" />
                <Pressable
                  onPress={openCollegeWebsite}
                  style={{ flex: 1 }}
                >
                  <VStack className="items-center py-3">
                    <Globe size={20} color={iconColors.accent} style={{ marginBottom: 4 }} />
                    <Text className="text-primary-500 font-inter-bold text-sm">
                      Visit
                    </Text>
                    <Text className="text-typography-500 text-xs text-center mt-1">
                      Website
                    </Text>
                  </VStack>
                </Pressable>
              </>
            )}
          </HStack>

          {/* Response Status Banner */}
          {hasResponded && (
            <Box
              className={`mt-4 p-4 rounded-xl flex-row items-center ${
                responseStatus === 'accepted'
                  ? 'bg-success-100'
                  : 'bg-error-100'
              }`}
            >
              {responseStatus === 'accepted' ? (
                <CheckCircle size={22} color="#16a34a" />
              ) : (
                <X size={22} color="#dc2626" />
              )}
              <VStack className="ml-3 flex-1">
                <Text
                  className={`font-inter-bold text-sm ${
                    responseStatus === 'accepted' ? 'text-success-700' : 'text-error-700'
                  }`}
                >
                  {responseStatus === 'accepted' ? 'Offer Accepted' : 'Offer Declined'}
                </Text>
                {existingResponse?.respondedAt && (
                  <Text className="text-typography-500 text-xs mt-0.5">
                    on {formatDate(existingResponse.respondedAt)}
                  </Text>
                )}
              </VStack>
            </Box>
          )}

          {/* Expiry Warning */}
          {!hasResponded && expiryDate && !isExpired && (
            (() => {
              const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              if (daysLeft <= 7) {
                return (
                  <Box className="mt-4 p-3 rounded-xl flex-row items-center bg-warning-100">
                    <Clock size={18} color="#f59e0b" />
                    <Text className="ml-2 text-sm font-inter-medium text-warning-700">
                      {daysLeft === 1 ? 'Expires tomorrow!' : `Only ${daysLeft} days left to respond`}
                    </Text>
                  </Box>
                );
              }
              return null;
            })()
          )}

          {/* Expired Banner */}
          {isExpired && !hasResponded && (
            <Box className="mt-4 p-3 rounded-xl flex-row items-center bg-error-100">
              <Clock size={18} color="#ef4444" />
              <Text className="ml-2 text-sm font-inter-medium text-error-700">
                This offer has expired
              </Text>
            </Box>
          )}

          {/* Description */}
          {offer.description && (
            <Box className="mt-6">
              <SectionHeader title="About This Scholarship" />
              <Text className="text-typography-600 text-sm leading-relaxed">
                {offer.description}
              </Text>
            </Box>
          )}

          {/* Required Documents */}
          {offer.requiredDocuments && offer.requiredDocuments.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Required Documents" />
              <VStack space="sm">
                {offer.requiredDocuments.map((doc, index) => (
                  <Box
                    key={doc._id || index}
                    className="bg-background-50 rounded-xl p-4 border border-outline-100"
                  >
                    <HStack className="items-start">
                      <Box
                        className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                        style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                      >
                        <FileText size={18} color={iconColors.accent} />
                      </Box>
                      <VStack className="flex-1">
                        <HStack className="items-center">
                          <Text className="text-typography-900 font-inter-semibold text-sm flex-1">
                            {doc.name}
                          </Text>
                          {doc.required && (
                            <Box className="bg-error-100 px-2 py-0.5 rounded">
                              <Text className="text-error-600 text-2xs font-inter-bold">
                                Required
                              </Text>
                            </Box>
                          )}
                        </HStack>
                        {doc.description && (
                          <Text className="text-typography-500 text-xs mt-1">
                            {doc.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {/* Formal Letter */}
          {offer.formalLetter && (
            <Box className="mt-6">
              <Pressable onPress={() => setExpandedLetter(!expandedLetter)}>
                <HStack className="items-center justify-between mb-3">
                  <Text className="text-typography-900 font-inter-bold text-base">
                    Formal Offer Letter
                  </Text>
                  <ChevronRight
                    size={20}
                    color={iconColors.secondary}
                    style={{
                      transform: [{ rotate: expandedLetter ? '90deg' : '0deg' }],
                    }}
                  />
                </HStack>
              </Pressable>
              {expandedLetter && (
                <Box className="bg-background-50 rounded-xl p-4 border border-outline-100">
                  <Text className="text-typography-600 text-sm leading-relaxed font-inter-regular">
                    {offer.formalLetter}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Terms */}
          {offer.terms && (
            <Box className="mt-6">
              <SectionHeader title="Terms & Conditions" />
              <Box className="bg-background-50 rounded-xl p-4 border border-outline-100">
                <Text className="text-typography-600 text-sm leading-relaxed">
                  {offer.terms}
                </Text>
              </Box>
            </Box>
          )}

          {/* College Info */}
          {offer.college?.description && (
            <Box className="mt-6">
              <SectionHeader title="About the College" />
              <Text className="text-typography-600 text-sm leading-relaxed">
                {offer.college.description}
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>

      {/* Bottom Action Bar - Fixed */}
      {!hasResponded && !isExpired && (
        <Box
          className="absolute bottom-0 left-0 right-0 bg-background-0 border-t border-outline-100"
          style={{
            paddingBottom: insets.bottom + 8,
            paddingTop: 12,
            paddingHorizontal: 16,
          }}
        >
          <HStack style={{ gap: 12 }}>
            {/* Decline Button */}
            <Box style={{ flex: 1 }}>
              <Pressable
                onPress={handleReject}
                disabled={actionLoading}
                style={({ pressed }) => ({ opacity: pressed || actionLoading ? 0.7 : 1 })}
              >
                <Box
                  className="rounded-xl py-3.5 items-center justify-center flex-row border-2 border-error-500"
                >
                  <X size={18} color="#ef4444" />
                  <Text className="text-error-500 font-inter-bold text-sm ml-2">
                    Decline
                  </Text>
                </Box>
              </Pressable>
            </Box>

            {/* Accept Button */}
            <Box style={{ flex: 1 }}>
              <Pressable
                onPress={handleAccept}
                disabled={actionLoading || !isEligible}
                style={({ pressed }) => ({ opacity: pressed || actionLoading || !isEligible ? 0.7 : 1 })}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <CheckCircle size={18} color="white" />
                      <Text className="text-white font-inter-bold text-sm ml-2">
                        Accept Offer
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </Box>
          </HStack>
        </Box>
      )}

      {/* Accept Offer Sheet */}
      {offer && (
        <AcceptOfferSheet
          visible={showAcceptSheet}
          onClose={() => setShowAcceptSheet(false)}
          offer={offer}
          onAcceptSuccess={handleAcceptSuccess}
        />
      )}
    </Box>
  );
}
