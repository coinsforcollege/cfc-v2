import React, { useState } from 'react';
import { View, ScrollView, Image, Dimensions, Pressable, Platform, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { ScreenContainer } from '@/components/navigation';
import { 
  CreditCard, 
  TrendingUp, 
  School, 
  ChevronRight, 
  Bell, 
  ShieldCheck, 
  Zap,
  Globe,
  Wallet,
  ArrowRight,
  Sparkles
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - (CARD_MARGIN * 2);

// --- Mock Data ---

const MOCK_BALANCE = {
  total: '1,250',
  currency: 'SP',
  tier: 'Gold Scholar',
  change: '+12% this week',
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

// Local 3D Icons
const iconTarget = require('@/assets/images/icons/3dicons-target-dynamic-color.png');
const iconFolder = require('@/assets/images/icons/3dicons-folder-fav-dynamic-color.png');
const iconCalendar = require('@/assets/images/icons/3dicons-calender-dynamic-color.png');
const iconChat = require('@/assets/images/icons/3dicons-chat-bubble-dynamic-color.png');

// --- Components ---

function Header({ user }: { user: any }) {
  return (
    <HStack className="justify-between items-center py-4 bg-background-0">
      <HStack space="sm" className="items-center">
         <Box className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center border-2 border-primary-200">
           <Text className="text-primary-700 font-bold text-lg">
             {user?.name?.[0] || 'S'}
           </Text>
         </Box>
         <VStack>
           <Text className="text-typography-500 text-[10px] font-bold tracking-widest uppercase">
             Welcome Back
           </Text>
           <Text className="text-typography-900 text-lg font-black leading-5">
             {user?.name?.split(' ')[0] || 'Scholar'}
           </Text>
         </VStack>
      </HStack>
      
      <Pressable style={({pressed}) => ({ opacity: pressed ? 0.7 : 1 })}>
        <Box className="w-10 h-10 rounded-full bg-background-50 items-center justify-center border border-outline-200 shadow-sm">
          <Bell size={20} color="#64748b" />
          {/* Notification Dot */}
          <Box className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error-500 border border-white" />
        </Box>
      </Pressable>
    </HStack>
  );
}

function PassportCard() {
  return (
    <Box className="md:mx-0 h-[220px] rounded-2xl overflow-hidden shadow-hard-4 relative my-2 bg-primary-900">
      {/* Background Image & Overlay */}
      <Image 
        source={require('@/assets/images/elegant-blue-wavy-pattern-background.png')}
        className="absolute w-full h-full opacity-30 dark:opacity-80"
        resizeMode="cover"
      />
      <Box className="absolute w-full h-full bg-primary-700 dark:bg-primary-0 opacity-80" />
      
      {/* Content Container */}
      <View className="flex-1 p-7 justify-between">
        {/* Top Row: Tier Badge & Brand */}
        <HStack className="justify-between items-start">
          <Box className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <HStack space="xs" className="items-center">
              <Sparkles size={12} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                {MOCK_BALANCE.tier}
              </Text>
            </HStack>
          </Box>
          <CreditCard size={24} color="rgba(255,255,255,0.4)" />
        </HStack>

        {/* Middle: Big Balance */}
        <VStack>
          <Text className="text-white/60 text-xs font-bold uppercase tracking-[0.15em] mb-1">
            Total Balance
          </Text>
          <HStack className="items-baseline">
            <Text className="text-white text-5xl font-black tracking-tight" style={{ fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' }}>
              {MOCK_BALANCE.total}
            </Text>
            <Text className="text-white/80 text-lg font-bold ml-2">
              {MOCK_BALANCE.currency}
            </Text>
          </HStack>
        </VStack>

        {/* Bottom: Change & Action */}
        <HStack className="justify-between items-end">
          <Box className="bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30 flex-row items-center">
            <TrendingUp size={12} color="#34d399" />
            <Text className="text-emerald-300 text-[10px] font-bold ml-1.5 uppercase tracking-wide">
              {MOCK_BALANCE.change}
            </Text>
          </Box>
          
          <Pressable 
             onPress={() => router.push('/(app)/tasks')}
             style={({pressed}) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] })}
          >
             <Box className="bg-white px-5 py-3 rounded-2xl shadow-lg flex-row items-center justify-center">
                <Text className="text-slate-900 font-extrabold text-xs tracking-wider uppercase mr-2.5">
                  Add Funds
                </Text>
                 <Box className="bg-slate-900 rounded-full p-0.5">
                   <ArrowRight size={10} color="white" strokeWidth={3} />
                 </Box>
             </Box>
          </Pressable>
        </HStack>
      </View>
    </Box>
  );
}

// Extracted for robust Hover state
function ActionButton({ item, isDark }: { item: any, isDark: boolean }) {
  return (
    <Pressable
      onPress={() => router.push(item.href as any)}
      className="md:w-[48%] md:h-[48%] hover:scale-[1.05] active:scale-[0.96] active:opacity-90 transition-transform duration-200"
    >
      {/* Gradient 3D Surface */}
      <LinearGradient
        colors={isDark ? item.colorsDark as [string, string] : item.colorsLight as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24 }} 
        className="w-16 h-16 md:w-full md:h-full mb-2 items-center justify-center rounded-3xl md:rounded-[36px]"
      >
          <Image 
            source={item.image} 
            style={{ width: Platform.OS === 'web' ? '60%' : 44, height: Platform.OS === 'web' ? '60%' : 44 }} 
            className="w-11 h-11 md:w-10 md:h-10 md:mb-1" 
            resizeMode="contain"
          />
          {/* Desktop Label (Inside) */}
          <Text className="hidden md:flex text-typography-800 text-[10px] font-bold uppercase tracking-wider text-center">
            {item.label}
          </Text>
      </LinearGradient>
      
      {/* Mobile Label (Outside) */}
      <Text className="md:hidden text-typography-600 text-sm font-bold tracking-tight text-center">
        {item.label}
      </Text>
    </Pressable>
  );
}

function ActionGrid() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const actions = [
    { 
      label: 'Tasks', 
      href: '/(app)/tasks', 
      image: iconTarget,
      colorsLight: ['#ecfdf5', '#10b981'], // Emerald 50 -> 500
      colorsDark: ['#064e3b', '#10b981'],   // Emerald 900 -> 500
    }, 
    { 
      label: 'Colleges', 
      href: '/(app)/colleges', 
      image: iconCalendar, 
      colorsLight: ['#eef2ff', '#6366f1'], // Indigo 50 -> 500
      colorsDark: ['#312e81', '#6366f1'],   // Indigo 900 -> 500
    },   
    { 
      label: 'Offers', 
      href: '/(app)/offers', 
      image: iconChat, 
      colorsLight: ['#fffbeb', '#f59e0b'], // Amber 50 -> 500
      colorsDark: ['#451a03', '#f59e0b'],   // Amber 900 -> 500
    },
    { 
      label: 'Docs', 
      href: '/(app)/documents', 
      image: iconFolder,
      colorsLight: ['#f0f9ff', '#0ea5e9'], // Sky 50 -> 500
      colorsDark: ['#0c4a6e', '#0ea5e9'],   // Sky 900 -> 500
    }, 
  ];

  return (
    <View className="my-6 flex-row justify-between items-start md:px-0 md:my-2 md:flex-wrap md:w-[220px] md:h-[220px] md:content-between">
      {actions.map((item, index) => (
        <ActionButton key={index} item={item} isDark={isDark} />
      ))}
    </View>
  );
}

function SectionTitle({ title, action, href }: { title: string, action?: string, href?: string }) {
  return (
    <HStack className="mb-4 items-center justify-between">
      <Text className="text-lg font-black text-typography-900 tracking-tight">
        {title}
      </Text>
      {action && href && (
        <Pressable 
          onPress={() => router.push(href as any)}
          hitSlop={10}
        >
          <Text className="text-primary-600 text-sm font-bold uppercase tracking-wider">
            {action}
          </Text>
        </Pressable>
      )}
    </HStack>
  );
}

function MarketplaceCarousel() {
  return (
    <Box className="mb-10">
      <SectionTitle title="Marketplace" action="View All" href="/(app)/colleges" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        decelerationRate="fast"
        snapToInterval={160 + 16} // card width + gap
      >
        {MOCK_COLLEGES.map((college) => (
          <Pressable 
            key={college.id}
            onPress={() => router.push('/(app)/colleges')}
            style={({pressed}) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <Box 
              className="w-40 h-[240px] rounded-[24px] overflow-hidden bg-slate-900 relative shadow-hard-2 border border-outline-100"
            >
              <Image 
                source={{ uri: college.image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
                locations={[0, 0.5, 1]}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' }}
              />
              
              <View className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                <Text className="text-white text-[10px] font-bold">
                  {college.match}
                </Text>
              </View>

              <View className="absolute bottom-4 left-4 right-4">
                 <Text className="text-white font-bold text-lg leading-6 mb-1">
                   {college.name}
                 </Text>
                 <Text className="text-white/70 text-xs font-medium uppercase tracking-wide">
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
    <Box className="mb-10 w-full">
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
                   <Text className="text-typography-900 font-bold text-sm mb-0.5">
                     {item.title}
                   </Text>
                   <Text className="text-typography-400 text-[11px] font-bold uppercase tracking-wide">
                     {item.time}
                   </Text>
                 </VStack>
               </HStack>
               
               <Box className={`px-2.5 py-1 rounded-lg ${item.type === 'earn' ? 'bg-success-100' : 'bg-background-100'}`}>
                 <Text className={`text-xs font-bold ${item.type === 'earn' ? 'text-success-700' : 'text-typography-600'}`}>
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
    <Box className="mb-24 cursor-default">
      <SectionTitle title="Wallet" action="View All" href="/(app)/offers" />
      <VStack space="sm">
      {MOCK_OFFERS.map((offer) => (
        <Box 
          key={offer.id} 
          className="bg-slate-900 p-6 rounded-[24px] shadow-hard-3 relative overflow-hidden"
        >
           {/* Subtle highlight instead of circles */}
           <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'transparent']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
           />

           <HStack className="justify-between items-center relative z-10">
             <VStack className="flex-1">
               <Text className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                 Scholarship Grant
               </Text>
               <Text className="text-white text-xl font-black leading-6">
                 {offer.title}
               </Text>
               <Text className="text-gray-400 text-xs mt-2 font-medium">
                 Expires: <Text className="text-white font-bold">{offer.deadline}</Text>
               </Text>
             </VStack>
             
             <View className="border-l border-white/10 pl-5 ml-4 justify-center items-center">
                <Text className="text-white font-black text-lg">
                  {offer.amount.split(',')[0]}k
                </Text>
                <Box className="bg-white/20 px-2 py-0.5 rounded mt-1">
                  <Text className="text-white text-[9px] font-bold uppercase">Claim</Text>
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
  
  return (
    <ScreenContainer showHeader={false} showBackButton={false}>
      <VStack className="flex-1 bg-background-0" space="md">
        
        {/* Sticky Header */}
        <Box className="bg-background-0 z-10">
          <Header user={user} />
        </Box>

        {/* Content */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          className="flex-1"
        >
          <View className="flex-col md:flex-row md:items-center md:justify-center md:gap-8 md:px-8 md:py-6">
            <Box className="w-full md:flex-1 md:max-w-3xl">
              <PassportCard />
            </Box>
            <Box className="w-full md:w-auto">
              <ActionGrid />
            </Box>
          </View>
          <MarketplaceCarousel />
          <LiveFeed />
          <WalletStack />
        </ScrollView>

      </VStack>
    </ScreenContainer>
  );
}
