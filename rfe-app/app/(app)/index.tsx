import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Image, Dimensions, Pressable, Platform, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  Bell,
  ShieldCheck,
  Zap,
  CircleDot,
  ListTodo,
  Building2,
  GraduationCap,
  FolderOpen,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- Mock Data ---

const MOCK_BALANCE = {
  total: '1,250',
  currency: 'SP',
};

const MOCK_COLLEGES = [
  { id: 1, name: 'Stanford', location: 'California', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop', match: '98%' },
  { id: 2, name: 'Harvard', location: 'Cambridge', image: 'https://images.unsplash.com/photo-1559135197-8a45ea74d367?w=600&h=800&fit=crop', match: '95%' },
  { id: 3, name: 'MIT', location: 'Massachusetts', image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&h=800&fit=crop', match: '92%' },
];

const MOCK_FEED = [
  { id: 1, type: 'earn', title: 'Physics Quiz Ace', amount: '+50 SP', time: '2m ago', icon: Zap, color: '#10b981', bg: 'bg-success-50' },
  { id: 2, type: 'info', title: 'New Scholarship Drop', amount: 'INFO', time: '1h ago', icon: Bell, color: '#3b82f6', bg: 'bg-info-50' },
  { id: 3, type: 'pending', title: 'Upload Transcripts', amount: 'TODO', time: 'Due Today', icon: ShieldCheck, color: '#f59e0b', bg: 'bg-warning-50' },
];

const MOCK_OFFERS = [
  { id: 1, title: 'Future Leaders Grant', amount: '$5,000', deadline: '3 Days' },
  { id: 2, title: 'STEM Initiative', amount: '$2,500', deadline: '1 Week' },
];


// --- Components ---

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Sticky header with top portion of gradient
function StickyHeader({ user, headerHeight }: { user: any; headerHeight: number }) {
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
                <Box className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#f59e0b' }}>
                  <Text className="text-white font-inter-bold text-base">
                    {user?.name?.[0]?.toUpperCase() || 'S'}
                  </Text>
                </Box>
              </HStack>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(app)/notifications')}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Box className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                <Bell size={18} color="rgba(255,255,255,0.9)" />
                <Box className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
              </Box>
            </Pressable>
          </HStack>
        </HStack>
      </View>
    </View>
  );
}

// Points row with bottom portion of gradient
function PointsRow({ headerHeight }: { headerHeight: number }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

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
        <HStack className="justify-between items-end">
          {/* Points Display */}
          <VStack>
            <Text className="text-indigo-300 text-xs font-inter-medium uppercase tracking-widest mb-1">
              Scholarship Points
            </Text>
            <HStack className="items-baseline">
              <Text className="text-white text-4xl font-inter-bold">
                {MOCK_BALANCE.total}
              </Text>
              <Text className="text-indigo-300 text-base font-inter-medium ml-1.5">
                {MOCK_BALANCE.currency}
              </Text>
            </HStack>
          </VStack>

          {/* Pending Tasks */}
          <Pressable
            onPress={() => router.push('/(app)/tasks')}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <HStack space="sm" className="items-center bg-white/10 px-4 py-2.5 rounded-full">
              <Animated.View style={{ opacity: pulseAnim }}>
                <CircleDot size={16} color="#fbbf24" />
              </Animated.View>
              <Text className="text-white text-sm font-inter-semibold">
                3 pending tasks
              </Text>
            </HStack>
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
      className="md:w-[48%] md:h-[48%] active:scale-[0.96] active:opacity-90 transition-transform duration-200"
    >
      <Box
        className="w-16 h-16 md:w-full md:h-full mb-2 items-center justify-center rounded-3xl bg-primary-600"
        style={Platform.OS === 'web' ? {} : { borderRadius: 18 }}
      >
        <IconComponent size={28} color="#FFFFFF" strokeWidth={1} />
        <Text className="hidden md:flex text-white text-[10px] font-inter-bold uppercase tracking-wider text-center mt-1">
          {item.label}
        </Text>
      </Box>

      <Text className="md:hidden text-typography-600 text-sm font-inter-bold tracking-tight text-center">
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
  ];

  return (
    <View className="mb-8 flex-row justify-between items-start md:px-0 md:my-2 md:flex-wrap md:w-[220px] md:h-[220px] md:content-between">
      {actions.map((item, index) => (
        <ActionButton key={index} item={item} />
      ))}
    </View>
  );
}

function SectionTitle({ title, action, href, onDark }: { title: string, action?: string, href?: string, onDark?: boolean }) {
  return (
    <HStack className="mb-4 items-center justify-between">
      <Text className={`text-lg font-inter-regular tracking-tight ${onDark ? 'text-white' : 'text-typography-900'}`}>
        {title}
      </Text>
      {action && href && (
        <Pressable
          onPress={() => router.push(href as any)}
          hitSlop={10}
        >
          <Text className={`text-sm font-inter-bold uppercase tracking-wider ${onDark ? 'text-indigo-300' : 'text-primary-600'}`}>
            {action}
          </Text>
        </Pressable>
      )}
    </HStack>
  );
}

function GradientOverlay() {
  return (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
      locations={[0, 0.3, 1]}
      className="absolute bottom-0 left-0 right-0 h-[70%]"
    />
  );
}

function SpotlightCarousel() {
  return (
    <Box className="my-6 mb-10">
      <Box className="px-4">
        <SectionTitle title="Spotlight" action="View All" href="/(app)/colleges" onDark />
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        decelerationRate="fast"
        snapToInterval={160 + 16}
      >
        {MOCK_COLLEGES.map((college) => (
          <Pressable 
            key={college.id}
            onPress={() => router.push('/(app)/colleges')}
            style={({pressed}) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <Box 
              className="w-40 h-[240px] rounded-3xl overflow-hidden bg-slate-900 relative shadow-hard-2 border border-outline-100"
            >
              <Image 
                source={{ uri: college.image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <GradientOverlay />
              
              <View className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                <Text className="text-white text-[10px] font-inter-bold">
                  {college.match}
                </Text>
              </View>

              <View className="absolute bottom-4 left-4 right-4">
                 <Text className="text-white font-inter-bold text-lg leading-6 mb-1">
                   {college.name}
                 </Text>
                 <Text className="text-white/70 text-xs font-inter-medium uppercase tracking-wide">
                   {college.location}
                 </Text>
              </View>
            </Box>
          </Pressable>
        ))}
      </ScrollView>
    </Box>
  );
}

function LiveFeed() {
  return (
    <Box className="mb-10 w-full px-4">
      <SectionTitle title="Live Activity" />
      <VStack space="md" className="">
        {MOCK_FEED.map((item) => (
          <Pressable key={item.id} style={({pressed}) => ({ opacity: pressed ? 0.7 : 1 })}>
             <HStack className="items-center justify-between bg-background-0 p-4 rounded-2xl border border-outline-100 border-opacity-50 shadow-sm">
               <HStack space="md" className="items-center flex-1">
                 <Box 
                   className={`w-12 h-12 rounded-2xl ${item.bg} items-center justify-center`}
                 >
                   <item.icon size={20} color={item.color} strokeWidth={2} />
                 </Box>
                 <VStack className="flex-1">
                   <Text className="text-typography-900 font-inter-bold text-sm mb-0.5">
                     {item.title}
                   </Text>
                   <Text className="text-typography-400 text-[11px] font-inter-bold uppercase tracking-wide">
                     {item.time}
                   </Text>
                 </VStack>
               </HStack>
               
               <Box className={`px-2.5 py-1 rounded-lg ${item.type === 'earn' ? 'bg-success-100' : 'bg-background-100'}`}>
                 <Text className={`text-xs font-inter-bold ${item.type === 'earn' ? 'text-success-700' : 'text-typography-600'}`}>
                   {item.amount}
                 </Text>
               </Box>
             </HStack>
          </Pressable>
        ))}
      </VStack>
    </Box>
  );
}

function WalletStack() {
  return (
    <Box className="mb-24 cursor-default px-4">
      <SectionTitle title="Wallet" action="View All" href="/(app)/offers" />
      <VStack space="sm">
      {MOCK_OFFERS.map((offer) => (
        <Box 
          key={offer.id} 
          className="bg-slate-900 p-6 rounded-3xl shadow-hard-3 relative overflow-hidden"
        >
           <LinearGradient
             colors={['rgba(255,255,255,0.05)', 'transparent']}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
             className="absolute top-0 left-0 right-0 bottom-0"
           />

           <HStack className="justify-between items-center relative z-10">
             <VStack className="flex-1">
               <Text className="text-amber-500 text-[10px] font-inter-bold uppercase tracking-widest mb-1.5">
                 Scholarship Grant
               </Text>
               <Text className="text-white text-xl font-inter-black leading-6">
                 {offer.title}
               </Text>
               <Text className="text-gray-400 text-xs mt-2 font-inter-medium">
                 Expires: <Text className="text-white font-inter-bold">{offer.deadline}</Text>
               </Text>
             </VStack>
             
             <View className="border-l border-white/10 pl-5 ml-4 justify-center items-center">
                <Text className="text-white font-inter-black text-lg">
                  {offer.amount.split(',')[0]}k
                </Text>
                <Box className="bg-white/20 px-2 py-0.5 rounded mt-1">
                  <Text className="text-white text-[9px] font-inter-bold uppercase">Claim</Text>
                </Box>
             </View>
           </HStack>
        </Box>
      ))}
      </VStack>
    </Box>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);
  const headerHeight = topPadding + 60;

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1b4b' }}>
      {/* Sticky Header */}
      <StickyHeader user={user} headerHeight={headerHeight} />

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
        <PointsRow headerHeight={headerHeight} />

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
            <SpotlightCarousel />
            <Box className="bg-background-0">
              <Box className="px-4">
                <ActionGrid />
              </Box>
              <LiveFeed />
              <WalletStack />
            </Box>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: 24,
  },
  gradientContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  gradientMid: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: '30%',
  },
  gradientBot: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    height: '40%',
  },
});
