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
  View,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  ChevronLeft,
  Heart,
  BookOpen,
  MapPin,
  Globe,
  School,
  Users,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
} from '@/components/navigation/icons';
import { collegesApi, College, CollegeInteractionStatus } from '@/src/api/colleges.api';

const TABLET_BREAKPOINT = 768;

// Fallback image
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop';

// Department list for fallback
const DEPARTMENT_LIST = [
  'Humanities', 'Arts', 'Science', 'Technology', 'Engineering',
  'Social Science', 'Business', 'Medicine', 'Law', 'Education',
];

// Theme colors for icons
const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
    accent: 'rgb(99, 102, 241)',
    success: 'rgb(16, 185, 129)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
    accent: 'rgb(129, 140, 248)',
    success: 'rgb(52, 211, 153)',
  },
};

function getDepartments(college: College): string[] {
  if (college.departments && college.departments.length > 0) {
    return college.departments;
  }
  const hash = college._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...DEPARTMENT_LIST].sort((a, b) => {
    const aHash = (hash + a.charCodeAt(0)) % 100;
    const bHash = (hash + b.charCodeAt(0)) % 100;
    return aHash - bHash;
  });
  return shuffled.slice(0, 3);
}

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-typography-900 font-bold text-base mb-3">
      {title}
    </Text>
  );
}

// Info Row Component
function InfoRow({ icon, label, value, onPress }: { icon: React.ReactNode; label: string; value: string; onPress?: () => void }) {
  const content = (
    <HStack className="items-center py-2">
      <Box className="w-8 h-8 rounded-lg bg-primary-100 items-center justify-center mr-3">
        {icon}
      </Box>
      <VStack className="flex-1">
        <Text className="text-typography-500 text-xs">{label}</Text>
        <Text className={`text-typography-900 text-sm font-medium ${onPress ? 'text-primary-600' : ''}`} numberOfLines={1}>
          {value}
        </Text>
      </VStack>
    </HStack>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}

// Stat Card Component
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <VStack className="flex-1 items-center py-3">
      <Text className="text-typography-900 font-bold text-lg">
        {value}
      </Text>
      <Text className="text-typography-500 text-xs text-center">
        {label}
      </Text>
    </VStack>
  );
}

export default function CollegeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { user, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<CollegeInteractionStatus>({
    isFollowing: false,
    isInterested: false,
  });
  const [actionLoading, setActionLoading] = useState<'follow' | 'interest' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  // Fetch college data only once when id changes
  useEffect(() => {
    if (id) {
      fetchCollege();
    }
  }, [id]);

  // Fetch status separately when auth changes
  useEffect(() => {
    if (id && isAuthenticated) {
      fetchStatus();
    }
  }, [id, isAuthenticated]);

  const fetchCollege = async () => {
    try {
      setLoading(true);
      setError(null);
      const college = await collegesApi.getById(id!);
      setCollege(college);
    } catch (err: any) {
      setError(err.message || 'Failed to load college');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await collegesApi.getCollegeStatus(id!);
      if (response.success) {
        setStatus(response.data);
      }
    } catch (err) {
      // Ignore - user might not be logged in
    }
  };

  const handleFollow = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    setActionLoading('follow');
    setActionError(null);
    try {
      if (status.isFollowing) {
        await collegesApi.unfollow(id!);
        setStatus(prev => ({ ...prev, isFollowing: false }));
      } else {
        await collegesApi.follow(id!);
        setStatus(prev => ({ ...prev, isFollowing: true }));
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to update follow status');
    } finally {
      setActionLoading(null);
    }
  }, [id, isAuthenticated, status.isFollowing]);

  const handleInterest = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    setActionLoading('interest');
    setActionError(null);
    try {
      if (status.isInterested) {
        await collegesApi.removeInterest(id!);
        setStatus(prev => ({ ...prev, isInterested: false }));
      } else {
        await collegesApi.expressInterest(id!);
        setStatus(prev => ({ ...prev, isInterested: true }));
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to update interest status');
    } finally {
      setActionLoading(null);
    }
  }, [id, isAuthenticated, status.isInterested]);

  const openURL = useCallback((url: string) => {
    if (url) {
      // Add https if missing
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(fullUrl);
    }
  }, []);

  if (loading) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <ActivityIndicator size="large" color={iconColors.accent} />
      </Box>
    );
  }

  if (error || !college) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center px-6">
        <School size={64} color={iconColors.muted} />
        <Text className="text-typography-900 text-lg font-semibold mt-4">
          College not found
        </Text>
        <Text className="text-typography-500 text-sm text-center mt-2">
          {error || 'The college you are looking for does not exist.'}
        </Text>
        <Button className="mt-6" onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  const coverImage = college.coverImage && college.coverImage.length > 10
    ? college.coverImage
    : FALLBACK_COVER;

  const departments = getDepartments(college);
  const hasContactInfo = college.website || college.email || college.phone;
  const hasSocialMedia = college.socialMedia && (
    college.socialMedia.facebook ||
    college.socialMedia.twitter ||
    college.socialMedia.instagram ||
    college.socialMedia.linkedin ||
    college.socialMedia.youtube
  );
  const hasCommunityLife = college.communityLife && (
    college.communityLife.totalMembers ||
    college.communityLife.internationalMembers ||
    college.communityLife.clubs
  );

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Cover Image Header */}
        <Box className="relative" style={{ height: isDesktop ? 300 : 220 }}>
          <Image
            source={{ uri: coverImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']}
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

          {/* College Logo & Name */}
          <Box
            className="absolute left-0 right-0 px-4"
            style={{ bottom: 16 }}
          >
            <HStack className="items-end" space="md">
              {/* Logo */}
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  backgroundColor: 'white',
                  padding: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {college.logo && college.logo.length > 5 ? (
                  <Image
                    source={{ uri: college.logo }}
                    style={{ width: '100%', height: '100%', borderRadius: 13 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 13,
                      backgroundColor: '#6366f1',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text className="text-white font-black text-2xl">
                      {college.name.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Name & Location */}
              <VStack className="flex-1 mb-1">
                <Text
                  className="text-white font-bold text-xl leading-tight"
                  numberOfLines={2}
                  style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
                >
                  {college.name}
                </Text>
                {(college.city || college.country) && (
                  <HStack className="items-center mt-1">
                    <MapPin size={12} color="white" />
                    <Text className="text-white/90 text-xs ml-1">
                      {college.city ? `${college.city}, ${college.country}` : college.country}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </HStack>
          </Box>
        </Box>

        {/* Content */}
        <Box className={`px-4 ${isDesktop ? 'max-w-[800px] self-center w-full' : ''}`}>
          {/* Action Buttons */}
          <HStack className="mt-4 mb-6 gap-5">
            <Pressable
              onPress={handleFollow}
              disabled={actionLoading === 'follow'}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <HStack className="items-center">
                {actionLoading === 'follow' ? (
                  <ActivityIndicator size="small" color={iconColors.accent} />
                ) : (
                  <>
                    <Heart
                      size={20}
                      color={status.isFollowing ? '#ef4444' : iconColors.secondary}
                      fill={status.isFollowing ? '#ef4444' : 'none'}
                    />
                    <Text className={`ml-2 text-sm font-medium ${status.isFollowing ? 'text-error-500' : 'text-typography-700'}`}>
                      {status.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </>
                )}
              </HStack>
            </Pressable>

            <Pressable
              onPress={handleInterest}
              disabled={actionLoading === 'interest'}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <HStack className="items-center">
                {actionLoading === 'interest' ? (
                  <ActivityIndicator size="small" color={iconColors.success} />
                ) : (
                  <>
                    <BookOpen
                      size={20}
                      color={status.isInterested ? iconColors.success : iconColors.secondary}
                    />
                    <Text className={`ml-2 text-sm font-medium ${status.isInterested ? 'text-success-600' : 'text-typography-700'}`}>
                      {status.isInterested ? 'Interested' : 'Study here'}
                    </Text>
                  </>
                )}
              </HStack>
            </Pressable>
          </HStack>

          {/* Action Error Message */}
          {actionError && (
            <Box className="mb-4 p-3 bg-error-100 rounded-xl">
              <Text className="text-error-600 text-sm text-center">{actionError}</Text>
            </Box>
          )}

          {/* Quick Stats Row */}
          <HStack className="bg-background-100 rounded-2xl mb-6">
            <StatCard value={college.type} label="Type" />
            <Box className="w-px bg-outline-200 my-3" />
            <StatCard value={college.status} label="Status" />
            {college.establishedYear && (
              <>
                <Box className="w-px bg-outline-200 my-3" />
                <StatCard value={college.establishedYear} label="Est." />
              </>
            )}
          </HStack>

          {/* Tagline */}
          {college.tagline && (
            <Box className="mb-6">
              <Text className="text-typography-600 text-base italic text-center">
                "{college.tagline}"
              </Text>
            </Box>
          )}

          {/* Admissions Info - moved above About */}
          {college.admissions && (college.admissions.acceptanceRate || college.admissions.applicationDeadline || college.admissions.tuitionFee) && (
            <Box className="mb-6">
              <SectionHeader title="Admissions" />
              <Box className="bg-background-100 rounded-xl p-4">
                {college.admissions.acceptanceRate && (
                  <HStack className="items-center justify-between mb-2">
                    <Text className="text-typography-600 text-sm">Acceptance Rate</Text>
                    <Text className="text-typography-900 font-semibold">
                      {college.admissions.acceptanceRate}%
                    </Text>
                  </HStack>
                )}
                {college.admissions.applicationDeadline && (
                  <HStack className="items-center justify-between mb-2">
                    <Text className="text-typography-600 text-sm">Application Deadline</Text>
                    <Text className="text-typography-900 font-semibold">
                      {college.admissions.applicationDeadline}
                    </Text>
                  </HStack>
                )}
                {college.admissions.tuitionFee?.international && (
                  <HStack className="items-center justify-between">
                    <Text className="text-typography-600 text-sm">Tuition (International)</Text>
                    <Text className="text-typography-900 font-semibold">
                      {college.admissions.tuitionFee.currency || '$'}{college.admissions.tuitionFee.international.toLocaleString()}
                    </Text>
                  </HStack>
                )}
              </Box>
            </Box>
          )}

          {/* About */}
          {(college.description || college.about) && (
            <Box className="mb-6">
              <SectionHeader title="About" />
              <Text className="text-typography-600 text-sm leading-relaxed">
                {college.about || college.description}
              </Text>
            </Box>
          )}

          {/* Mission & Vision */}
          {(college.mission || college.vision) && (
            <Box className="mb-6">
              {college.mission && (
                <Box className="mb-4">
                  <SectionHeader title="Our Mission" />
                  <Text className="text-typography-600 text-sm leading-relaxed">
                    {college.mission}
                  </Text>
                </Box>
              )}
              {college.vision && (
                <Box>
                  <SectionHeader title="Our Vision" />
                  <Text className="text-typography-600 text-sm leading-relaxed">
                    {college.vision}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {/* Departments */}
          <Box className="mb-6">
            <SectionHeader title="Academic Departments" />
            <HStack className="flex-wrap gap-2">
              {departments.map((dept) => (
                <Box
                  key={dept}
                  className="px-3 py-1.5 rounded-full bg-primary-100"
                >
                  <Text className="text-primary-700 text-sm font-medium">
                    {dept}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>

          {/* Community Life / Student Life */}
          {hasCommunityLife && (
            <Box className="mb-6">
              <SectionHeader title="Student Life" />
              <HStack className="bg-background-100 rounded-2xl">
                {college.communityLife?.totalMembers && (
                  <StatCard
                    value={college.communityLife.totalMembers.toLocaleString()}
                    label="Students"
                  />
                )}
                {college.communityLife?.totalMembers && college.communityLife?.internationalMembers && (
                  <Box className="w-px bg-outline-200 my-3" />
                )}
                {college.communityLife?.internationalMembers && (
                  <StatCard
                    value={college.communityLife.internationalMembers.toLocaleString()}
                    label="International"
                  />
                )}
                {(college.communityLife?.totalMembers || college.communityLife?.internationalMembers) && college.communityLife?.clubs && (
                  <Box className="w-px bg-outline-200 my-3" />
                )}
                {college.communityLife?.clubs && (
                  <StatCard
                    value={`${college.communityLife.clubs}+`}
                    label="Clubs"
                  />
                )}
              </HStack>
              {college.communityLife?.memberToFacultyRatio && (
                <Text className="text-typography-500 text-xs text-center mt-2">
                  Student to Faculty Ratio: {college.communityLife.memberToFacultyRatio}
                </Text>
              )}
            </Box>
          )}

          {/* Campus Size */}
          {college.campusSize?.value && (
            <Box className="mb-6">
              <SectionHeader title="Campus" />
              <Box className="bg-background-100 rounded-xl p-4">
                <HStack className="items-center">
                  <Box className="w-10 h-10 rounded-lg bg-primary-100 items-center justify-center mr-3">
                    <MapPin size={20} color={iconColors.accent} />
                  </Box>
                  <VStack>
                    <Text className="text-typography-900 font-bold text-lg">
                      {college.campusSize.value} {college.campusSize.unit}
                    </Text>
                    <Text className="text-typography-500 text-xs">
                      Total Campus Area
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          )}

          {/* Contact Information */}
          {hasContactInfo && (
            <Box className="mb-6">
              <SectionHeader title="Contact" />
              <Box className="bg-background-100 rounded-xl px-3">
                {college.website && (
                  <InfoRow
                    icon={<Globe size={16} color={iconColors.accent} />}
                    label="Website"
                    value={college.website.replace(/^https?:\/\//, '')}
                    onPress={() => openURL(college.website!)}
                  />
                )}
                {college.email && (
                  <InfoRow
                    icon={<Mail size={16} color={iconColors.accent} />}
                    label="Email"
                    value={college.email}
                    onPress={() => Linking.openURL(`mailto:${college.email}`)}
                  />
                )}
                {college.phone && (
                  <InfoRow
                    icon={<Phone size={16} color={iconColors.accent} />}
                    label="Phone"
                    value={college.phone}
                    onPress={() => Linking.openURL(`tel:${college.phone}`)}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Social Media */}
          {hasSocialMedia && (
            <Box className="mb-6">
              <SectionHeader title="Follow Us" />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {college.socialMedia?.facebook && (
                  <Pressable
                    onPress={() => openURL(college.socialMedia!.facebook!)}
                    style={({ pressed }) => ({
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#1877f2',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Facebook size={20} color="white" />
                  </Pressable>
                )}
                {college.socialMedia?.twitter && (
                  <Pressable
                    onPress={() => openURL(college.socialMedia!.twitter!)}
                    style={({ pressed }) => ({
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: isDark ? '#ffffff' : '#000000',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text style={{ color: isDark ? '#000000' : '#ffffff', fontWeight: '800', fontSize: 16 }}>X</Text>
                  </Pressable>
                )}
                {college.socialMedia?.instagram && (
                  <Pressable
                    onPress={() => openURL(college.socialMedia!.instagram!)}
                    style={({ pressed }) => ({
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#E4405F',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Instagram size={20} color="white" />
                  </Pressable>
                )}
                {college.socialMedia?.linkedin && (
                  <Pressable
                    onPress={() => openURL(college.socialMedia!.linkedin!)}
                    style={({ pressed }) => ({
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#0A66C2',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Linkedin size={20} color="white" />
                  </Pressable>
                )}
                {college.socialMedia?.youtube && (
                  <Pressable
                    onPress={() => openURL(college.socialMedia!.youtube!)}
                    style={({ pressed }) => ({
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#FF0000',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Youtube size={20} color="white" />
                  </Pressable>
                )}
              </View>
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
