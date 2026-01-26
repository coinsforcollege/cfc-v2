import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { studentApi, StudentProfile } from '@/src/api/student.api';
import config from '@/src/config';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  User,
  Mail,
  Lock,
  Trash2,
  GraduationCap,
  MapPin,
  Building2,
  Heart,
  Star,
  Award,
  Target,
  LogOut,
  School,
  Globe,
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

// Stat Card Component - Compact version without icons
function StatCard({
  label,
  value,
  color,
  onPress,
}: {
  label: string;
  value: string | number;
  color: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ 
        opacity: pressed && onPress ? 0.7 : 1,
        width: '100%'
      })}
      disabled={!onPress}
    >
      <Box className="bg-background-0 border border-outline-100 p-3 rounded-xl items-center" style={{ width: '100%' }}>
        <Text className="text-typography-900 text-lg font-inter-bold" style={{ color }}>
          {value}
        </Text>
        <Text className="text-typography-500 text-[10px] font-inter-medium text-center mt-0.5">
          {label}
        </Text>
      </Box>
    </Pressable>
  );
}

// Settings Row Component
function SettingsRow({
  icon: Icon,
  label,
  value,
  onPress,
  showChevron = true,
  iconColor = '#6366f1',
  destructive = false,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress: () => void;
  showChevron?: boolean;
  iconColor?: string;
  destructive?: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <HStack className="py-3.5 items-center">
        <Box
          className="w-9 h-9 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: destructive ? '#fee2e2' : `${iconColor}15` }}
        >
          <Icon size={18} color={destructive ? '#ef4444' : iconColor} strokeWidth={2} />
        </Box>
        <VStack className="flex-1">
          <Text
            className={`text-base font-inter-medium ${
              destructive ? 'text-error-600' : 'text-typography-900'
            }`}
          >
            {label}
          </Text>
          {value && (
            <Text className="text-typography-500 text-sm font-inter-regular" numberOfLines={1}>
              {value}
            </Text>
          )}
        </VStack>
        {showChevron && (
          <ChevronRight size={20} color={iconColors.muted} strokeWidth={2} />
        )}
      </HStack>
    </Pressable>
  );
}

// Section Header
function SectionHeader({ title, onEdit }: { title: string; onEdit?: () => void }) {
  return (
    <HStack className="items-center justify-between mb-2">
      <Text className="text-xs font-inter-bold uppercase tracking-widest text-typography-400 ml-1">
        {title}
      </Text>
      {onEdit && (
        <Pressable onPress={onEdit} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text className="text-primary-500 text-xs font-inter-bold uppercase tracking-widest mr-1">
            Edit
          </Text>
        </Pressable>
      )}
    </HStack>
  );
}

// Section Container
function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box className="bg-background-0 rounded-2xl px-4 border border-outline-100">
      {children}
    </Box>
  );
}

// Divider
function Divider() {
  return <Box className="h-px bg-outline-100 ml-12" />;
}

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;
  const { width } = Dimensions.get('window');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await studentApi.getProfile(token);
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

  // Handle profile picture selection
  const handleSelectProfilePicture = useCallback(async () => {
    if (!token) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileName = asset.fileName || `profile_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';

      setUploadingImage(true);
      try {
        const response = await studentApi.uploadProfilePicture(
          token,
          asset.uri,
          fileName,
          mimeType
        );
        if (response.success) {
          setProfile((prev) =>
            prev ? { ...prev, profilePicture: response.data.profilePicture } : prev
          );
        }
      } catch (error: any) {
        Alert.alert('Upload Failed', error.message || 'Failed to upload profile picture');
      } finally {
        setUploadingImage(false);
      }
    }
  }, [token]);

  // Handle logout
  const handleLogout = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }, [logout]);

  // Navigation handlers
  const handleEditProfile = () => {
    router.push('/(app)/edit-profile');
  };

  const handleChangeEmail = () => {
    router.push('/(app)/change-email');
  };

  const handleChangePassword = () => {
    router.push('/(app)/change-password');
  };

  const handleDeleteAccount = () => {
    router.push('/(app)/delete-account');
  };

  const handleViewFavorites = () => {
    router.push('/(app)/favorites');
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (!profile?.profilePicture) return null;
    if (profile.profilePicture.startsWith('http')) return profile.profilePicture;
    const baseUrl = config.apiUrl.replace('/api', '');
    return `${baseUrl}${profile.profilePicture}`;
  };

  return (
    <Box className="flex-1 bg-background-0">
      {/* Sticky Header */}
      <Box
        className="bg-background-0 border-b border-outline-100"
        style={{ paddingTop: topPadding, zIndex: 10 }}
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
            Profile
          </Text>
          <Box className="w-10 h-10" />
        </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 40),
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Profile Header Section */}
        <VStack className="items-center px-4 py-6">
          {/* Avatar */}
          {loading ? (
            <Skeleton width={100} height={100} borderRadius={50} />
          ) : (
            <Pressable
              onPress={handleSelectProfilePicture}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              disabled={uploadingImage}
            >
              <Box className="relative">
                {getProfilePictureUrl() ? (
                  <Image
                    source={{ uri: getProfilePictureUrl()! }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                ) : (
                  <Box className="w-[100px] h-[100px] rounded-full bg-primary-500 items-center justify-center">
                    <Text className="text-typography-0 text-4xl font-inter-bold">
                      {profile?.name?.charAt(0).toUpperCase() || 'S'}
                    </Text>
                  </Box>
                )}
                <Box className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background-0 border-2 border-background-50 items-center justify-center">
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color="#6366f1" />
                  ) : (
                    <Camera size={16} color="#6366f1" strokeWidth={2} />
                  )}
                </Box>
              </Box>
            </Pressable>
          )}

          {/* Name */}
          {loading ? (
            <Skeleton width={150} height={28} borderRadius={6} style={{ marginTop: 12 }} />
          ) : (
            <Text className="text-2xl font-inter-bold text-typography-900 mt-3">
              {profile?.name || 'Student'}
            </Text>
          )}

          {/* Grade and School */}
          {loading ? (
            <Skeleton width={200} height={16} borderRadius={4} style={{ marginTop: 8 }} />
          ) : (
            <HStack className="items-center mt-1" space="sm">
              {profile?.gradeLevel && (
                <HStack className="items-center" space="xs">
                  <GraduationCap size={14} color={iconColors.secondary} />
                  <Text className="text-typography-500 text-sm font-inter-medium">
                    Grade {profile.gradeLevel}
                  </Text>
                </HStack>
              )}
              {profile?.gradeLevel && profile?.school?.name && (
                <Text className="text-typography-400">|</Text>
              )}
              {profile?.school?.name && (
                <HStack className="items-center" space="xs">
                  <School size={14} color={iconColors.secondary} />
                  <Text className="text-typography-500 text-sm font-inter-medium" numberOfLines={1}>
                    {profile.school.name}
                  </Text>
                </HStack>
              )}
            </HStack>
          )}

          {/* Location */}
          {loading ? (
            <Skeleton width={120} height={16} borderRadius={4} style={{ marginTop: 4 }} />
          ) : profile?.country ? (
            <HStack className="items-center mt-1" space="xs">
              <MapPin size={14} color={iconColors.secondary} />
              <Text className="text-typography-500 text-sm font-inter-medium">
                {profile.country}
              </Text>
            </HStack>
          ) : null}
        </VStack>

        {/* Stats Grid - 4 in a row */}
        <Box className="px-4 mb-6">
          <Box className="flex-row">
            {loading ? (
              [0, 1, 2, 3].map((index) => {
                const cardWidth = (width - 32 - 24) / 4;
                return (
                  <Box
                    key={index}
                    style={{
                      width: cardWidth,
                      marginRight: index < 3 ? 8 : 0,
                    }}
                  >
                    <Skeleton width="100%" height={70} borderRadius={12} />
                  </Box>
                );
              })
            ) : (
              [
                { label: 'Favorite\nColleges', value: profile?.stats.followedCollegesCount || 0, color: '#6366f1', onPress: handleViewFavorites },
                { label: 'Scholarship\nPoints', value: profile?.stats.scholarshipPoints || 0, color: '#f59e0b' },
                { label: 'Scholarship\nOffers', value: profile?.stats.offers.total || 0, color: '#10b981', onPress: () => router.push('/(app)/offers') },
                { label: 'College\nReadiness', value: `${profile?.stats.collegeReadinessScore || 0}/10`, color: '#8b5cf6' },
              ].map((stat, index) => {
                const cardWidth = (width - 32 - 24) / 4;
                return (
                  <Box
                    key={index}
                    style={{
                      width: cardWidth,
                      marginRight: index < 3 ? 8 : 0,
                    }}
                  >
                    <StatCard
                      label={stat.label}
                      value={stat.value}
                      color={stat.color}
                      onPress={stat.onPress}
                    />
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        {/* Personal Info Section */}
        <Box className="px-4 mb-4">
          <SectionHeader title="Personal Information" onEdit={handleEditProfile} />
          <SectionContainer>
            <SettingsRow
              icon={User}
              label="Name"
              value={profile?.name}
              onPress={() => {}}
              showChevron={false}
              iconColor="#6366f1"
            />
            <Divider />
            <SettingsRow
              icon={GraduationCap}
              label="Grade Level"
              value={profile?.gradeLevel ? `Grade ${profile.gradeLevel}` : 'Not set'}
              onPress={() => {}}
              showChevron={false}
              iconColor="#f59e0b"
            />
            <Divider />
            <SettingsRow
              icon={School}
              label="School"
              value={profile?.school?.name || 'Not set'}
              onPress={() => {}}
              showChevron={false}
              iconColor="#10b981"
            />
            <Divider />
            <SettingsRow
              icon={MapPin}
              label="Country"
              value={profile?.country || 'Not set'}
              onPress={() => {}}
              showChevron={false}
              iconColor="#3b82f6"
            />
            <Divider />
            <SettingsRow
              icon={Globe}
              label="Desired College Countries"
              value={
                profile?.desiredCollegeCountries?.length
                  ? profile.desiredCollegeCountries.join(', ')
                  : 'Not set'
              }
              onPress={() => {}}
              showChevron={false}
              iconColor="#8b5cf6"
            />
          </SectionContainer>
        </Box>

        {/* Colleges Section */}
        <Box className="px-4 mb-4">
          <SectionHeader title="Colleges" />
          <SectionContainer>
            <SettingsRow
              icon={Heart}
              label="Following"
              value={`${profile?.stats.followedCollegesCount || 0} colleges`}
              onPress={handleViewFavorites}
              iconColor="#ef4444"
            />
            <Divider />
            <SettingsRow
              icon={Star}
              label="Shortlisted"
              value={`${profile?.stats.interestedCollegesCount || 0} colleges`}
              onPress={handleViewFavorites}
              iconColor="#f59e0b"
            />
          </SectionContainer>
        </Box>

        {/* Account Settings Section */}
        <Box className="px-4 mb-4">
          <SectionHeader title="Account Settings" />
          <SectionContainer>
            <SettingsRow
              icon={Mail}
              label="Change Email"
              value={profile?.email}
              onPress={handleChangeEmail}
              iconColor="#3b82f6"
            />
            <Divider />
            <SettingsRow
              icon={Lock}
              label="Change Password"
              onPress={handleChangePassword}
              iconColor="#10b981"
            />
            <Divider />
            <SettingsRow
              icon={Trash2}
              label="Delete Account"
              onPress={handleDeleteAccount}
              destructive
            />
          </SectionContainer>
        </Box>

        {/* Sign Out */}
        <Box className="px-4 mb-6">
          <SectionContainer>
            <SettingsRow
              icon={LogOut}
              label="Sign Out"
              onPress={handleLogout}
              showChevron={false}
              destructive
            />
          </SectionContainer>
        </Box>

        {/* Account Info */}
        <VStack className="px-4 items-center mb-8">
          <Text className="text-typography-400 text-xs font-inter-regular">
            Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
          </Text>
          {profile?.accountDeletionRequest?.status === 'pending' && (
            <Box className="mt-2 bg-warning-100 px-3 py-1.5 rounded-full">
              <Text className="text-warning-700 text-xs font-inter-bold">
                Account deletion request pending
              </Text>
            </Box>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}
