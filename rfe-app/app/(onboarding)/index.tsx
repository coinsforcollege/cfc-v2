import React, { useRef, useState } from 'react';
import { View, Text, StatusBar, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiquidButton from '@/components/onboarding/LiquidButton';
import SlidingLogos from '@/components/onboarding/SlidingLogos';
import TrajectoryChart from '@/components/onboarding/TrajectoryChart';
import CyclingIcons from '@/components/onboarding/CyclingIcons';
import { storage } from '@/src/utils/storage';

const screens = [
  {
    title: 'L-Earn Your Way',
    titleAccent: 'to College',
    subtitle: 'Complete tasks. Earn Scholarship Points. Unlock real scholarships from colleges worldwide.',
    Visual: SlidingLogos,
  },
  {
    title: 'Short-Term Rewards,',
    titleAccent: 'Long-Term Goals',
    subtitle: 'Every task brings you closer to up to 100% scholarships. Start early, build your trajectory.',
    Visual: TrajectoryChart,
  },
  {
    title: 'Everything You Need',
    titleAccent: 'in One Place',
    subtitle: 'AI-guided college prep. Academic Docs. One-click applications. Immigration and finances.',
    Visual: CyclingIcons,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = async () => {
    if (currentPage < screens.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      await storage.setOnboardingComplete();
      router.replace('/(auth)/login');
    }
  };

  const getProgress = () => {
    return (currentPage + 1) / screens.length;
  };

  const getButtonLabel = () => {
    return currentPage === screens.length - 1 ? 'Start Your Journey' : 'Next';
  };

  return (
    <ImageBackground
      source={require('@/assets/images/onboarding-background-4.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Dark gradient overlay - 0% at top, 90% at bottom */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={{ flex: 1 }}>
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          scrollEnabled={true}
        >
          {screens.map((screen, index) => (
            <View key={index} className="flex-1">
              {/* Visual - upper area */}
              <View className="flex-1" style={{ marginTop: 100 }}>
                <screen.Visual />
              </View>

              {/* Text content - bottom area */}
              <View className="px-6 pb-4">
                {/* Title */}
                <Text className="text-4xl font-inter-black text-white uppercase mb-1">
                  {screen.title}
                </Text>
                <Text className="text-4xl font-inter-black text-primary-300 uppercase mb-4">
                  {screen.titleAccent}
                </Text>

                {/* Subtitle */}
                <Text className="text-lg text-white/80 font-inter-regular leading-7">
                  {screen.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </PagerView>

        {/* Fixed Button - outside PagerView */}
        <View
          className="px-6"
          style={{ paddingBottom: insets.bottom + 16, marginBottom: 60 }}
        >
          <LiquidButton
            onPress={handleNext}
            progress={getProgress()}
            label={getButtonLabel()}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
