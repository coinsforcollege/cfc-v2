import React, { useState, useCallback } from 'react';
import { View, ScrollView, Image, Pressable, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { notificationsApi } from '@/src/api/notifications.api';
import { studentApi } from '@/src/api/student.api';
import { scholarshipApi } from '@/src/api/scholarship.api';
import { offersApi } from '@/src/api/offers.api';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { OfferReelCarousel } from '@/components/home/OfferReelCarousel';
import { ActiveTasksSection } from '@/components/home/ActiveTasksSection';
import { CollegeReadinessSection } from '@/components/home/CollegeReadinessSection';
import { ActivityHistorySection } from '@/components/home/ActivityHistorySection';
import {
  Bell,
  ListTodo,
  Building2,
  GraduationCap,
  FolderOpen,
  ChevronRight,
  Target,
} from 'lucide-react-native';

// Format currency helper
function formatCurrency(value: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

// --- Components ---

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Sticky header with top portion of gradient
function StickyHeader({ user, headerHeight, unreadCount, profilePicture }: { user: any; headerHeight: number; unreadCount: number; profilePicture?: string | null }) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);
  const firstName = user?.name?.split(' ')[0] || 'Scholar';

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: headerHeight, overflow: 'hidden' }}>
      {/* Vertical gradient - top portion */}
      <LinearGradient
        colors={['#1e1b4b', '#312e81']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={require('@/assets/images/elegant-blue-wavy-pattern-background.png')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 250, opacity: 0.02 }}
        resizeMode="cover"
      />

      <View style={{ paddingTop: topPadding, paddingHorizontal: 20, paddingBottom: 12 }}>
        <HStack className="justify-between items-center pt-2">
          {/* Logo + Branding */}
          <HStack space="sm" className="items-center">
            <Image
              source={require('@/assets/images/icons/app-icon-transparent-bg.png')}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
            <VStack>
              <Text className="text-white text-base font-inter-bold leading-4 tracking-tight uppercase">
                Rewards For
              </Text>
              <Text className="text-amber-300 text-base font-inter-bold leading-4 tracking-tight uppercase">
                Education
              </Text>
            </VStack>
          </HStack>

          {/* Right - Profile & Notification */}
          <HStack space="sm" className="items-center">
            <Pressable
              onPress={() => router.push('/(app)/profile')}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <HStack space="sm" className="items-center">
                <VStack className="items-end">
                  <Text className="text-indigo-300 text-[10px] font-inter-medium">
                    {getGreeting()}
                  </Text>
                  <Text className="text-white text-sm font-inter-bold">
                    {firstName}
                  </Text>
                </VStack>
                <UserAvatar name={user?.name || 'Scholar'} profilePicture={profilePicture} size={40} />
              </HStack>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(app)/notifications')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Box className="rounded-full bg-white/10 items-center justify-center" style={{ width: 40, height: 40 }}>
                <Bell size={18} color="rgba(255,255,255,0.9)" />
                {unreadCount > 0 && (
                  <Box className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </Box>
            </Pressable>
          </HStack>
        </HStack>
      </View>
    </View>
  );
}

// Points row with bottom portion of gradient
function PointsRow({
  headerHeight,
  balance,
  loading,
  potentialValue,
  potentialCurrency,
}: {
  headerHeight: number;
  balance: number;
  loading: boolean;
  potentialValue: number;
  potentialCurrency: string;
}) {
  return (
    <View style={{ overflow: 'hidden' }}>
      {/* Vertical gradient - bottom portion, starts where header ends */}
      <LinearGradient
        colors={['#312e81', '#3730a3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={require('@/assets/images/elegant-blue-wavy-pattern-background.png')}
        style={{ position: 'absolute', top: -headerHeight, left: 0, right: 0, height: 250, opacity: 0.02 }}
        resizeMode="cover"
      />

      <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
        <HStack className="justify-between items-start">
          {/* Points Display - Tappable */}
          <Pressable
            onPress={() => router.push('/(app)/scholarship-points')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <VStack>
              <HStack className="items-center mb-1">
                <Text className="text-indigo-300 text-xs font-inter-medium uppercase tracking-widest">
                  Scholarship Points
                </Text>
                <ChevronRight size={16} color="rgba(199, 210, 254, 0.6)" style={{ marginLeft: 4 }} />
              </HStack>
              <HStack className="items-baseline">
                {loading ? (
                  <Text className="text-white text-4xl font-inter-bold">---</Text>
                ) : (
                  <Text className="text-white text-4xl font-inter-bold">
                    {balance.toLocaleString()}
                  </Text>
                )}
                <Text className="text-indigo-300 text-base font-inter-medium ml-1.5">
                  SP
                </Text>
              </HStack>
            </VStack>
          </Pressable>

          {/* Potential Value - Tappable to offers */}
          <Pressable
            onPress={() => router.push('/(app)/offers')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Box className="bg-white/10 px-4 py-3 rounded-2xl">
              <VStack className="items-end">
                <Text className="text-indigo-300 text-[10px] font-inter-medium uppercase tracking-wider mb-1">
                  Potential Value
                </Text>
                <Text className="text-amber-400 text-xl font-inter-bold">
                  {loading ? '---' : formatCurrency(potentialValue, potentialCurrency)}
                </Text>
              </VStack>
            </Box>
          </Pressable>
        </HStack>
      </View>
    </View>
  );
}

function ActionButton({ item }: { item: any }) {
  const IconComponent = item.icon;
  return (
    <Pressable
      onPress={() => router.push(item.href as any)}
      className="items-center md:w-[48%] md:h-[48%] active:scale-[0.96] active:opacity-90 transition-transform duration-200"
    >
      <Box
        className="w-14 h-14 md:w-full md:h-full mb-1.5 items-center justify-center rounded-2xl bg-primary-600"
        style={Platform.OS === 'web' ? {} : { borderRadius: 14 }}
      >
        <IconComponent size={24} color="#FFFFFF" strokeWidth={1} />
        <Text className="hidden md:flex text-white text-[10px] font-inter-bold uppercase tracking-wider text-center mt-1">
          {item.label}
        </Text>
      </Box>

      <Text className="md:hidden text-typography-600 text-xs font-inter-bold tracking-tight text-center">
        {item.label}
      </Text>
    </Pressable>
  );
}

function ActionGrid() {
  const actions = [
    { label: 'Tasks', href: '/(app)/tasks', icon: ListTodo },
    { label: 'Colleges', href: '/(app)/colleges', icon: Building2 },
    { label: 'Offers', href: '/(app)/offers', icon: GraduationCap },
    { label: 'Docs', href: '/(app)/documents', icon: FolderOpen },
    { label: 'Readiness', href: '/(app)/college-prep', icon: Target },
  ];

  return (
    <View className="mb-8 flex-row justify-between items-start md:px-0 md:my-2 md:flex-wrap md:w-[220px] md:h-[220px] md:content-between">
      {actions.map((item, index) => (
        <ActionButton key={index} item={item} />
      ))}
    </View>
  );
}


export default function HomeScreen() {
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);
  const headerHeight = topPadding + 60;
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [scholarshipBalance, setScholarshipBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [potentialValue, setPotentialValue] = useState(0);
  const [potentialCurrency, setPotentialCurrency] = useState('USD');

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await notificationsApi.getUnreadCount(token);
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [token]);

  const fetchProfilePicture = useCallback(async () => {
    if (!token) return;
    try {
      const response = await studentApi.getProfile(token);
      if (response.success) {
        setProfilePicture(response.data.profilePicture || null);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [token]);

  const fetchScholarshipBalance = useCallback(async () => {
    if (!token) return;
    try {
      const response = await scholarshipApi.getWallet(token);
      if (response.success) {
        setScholarshipBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching scholarship balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  }, [token]);

  const fetchOffersTotal = useCallback(async () => {
    if (!token) return;
    try {
      // Fetch both accepted and active offers
      const [acceptedResponse, activeResponse] = await Promise.all([
        offersApi.getOffers(token, { status: 'accepted', limit: 100 }),
        offersApi.getOffers(token, { status: 'active', limit: 100 }),
      ]);

      // Combine all offers
      const allOffers = [
        ...(acceptedResponse.success ? acceptedResponse.data : []),
        ...(activeResponse.success ? activeResponse.data : []),
      ];

      if (allOffers.length > 0) {
        const highest = Math.max(...allOffers.map(offer => offer.totalValue));
        const highestOffer = allOffers.find(o => o.totalValue === highest);
        setPotentialValue(highest);
        setPotentialCurrency(highestOffer?.currency || 'USD');
      } else {
        setPotentialValue(0);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
      fetchProfilePicture();
      fetchScholarshipBalance();
      fetchOffersTotal();
    }, [fetchUnreadCount, fetchProfilePicture, fetchScholarshipBalance, fetchOffersTotal])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1b4b' }}>
      {/* Sticky Header */}
      <StickyHeader user={user} headerHeight={headerHeight} unreadCount={unreadCount} profilePicture={profilePicture} />

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: Math.max(insets.bottom, 40),
        }}
        style={{ flex: 1 }}
      >
        {/* Points Row */}
        <PointsRow
          headerHeight={headerHeight}
          balance={scholarshipBalance}
          loading={balanceLoading}
          potentialValue={potentialValue}
          potentialCurrency={potentialCurrency}
        />

        {/* Rest of Content with fade overlay */}
        <View style={{ position: 'relative' }}>
          {/* Hero fade overlay - fades from hero color to transparent */}
          {/* Layer 1a: Light background for content area */}
          <Box className="bg-background-0" style={StyleSheet.absoluteFill} />

          {/* Layer 1b: Dark backing gradient (fades with hero gradient) */}
          <LinearGradient
            colors={['#1e1b4b', 'rgba(30, 27, 75, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 250 }}
          />

          {/* Layer 2: Gradient fade from hero to transparent */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 250,
              overflow: 'hidden',
            }}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['#3730a3', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Image
              source={require('@/assets/images/elegant-blue-wavy-pattern-background.png')}
              style={{ position: 'absolute', top: -(headerHeight + 100), left: 0, right: 0, height: 250, opacity: 0.02 }}
              resizeMode="cover"
            />
          </View>

          {/* Layer 3: Content */}
          <View>
            <OfferReelCarousel onDark />
            <Box className="bg-background-0">
              <Box className="px-4">
                <ActionGrid />
              </Box>
              <ActiveTasksSection />
              <CollegeReadinessSection />
              <ActivityHistorySection />
            </Box>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

