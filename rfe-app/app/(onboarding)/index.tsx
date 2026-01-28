import React, { useRef, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
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
    title: 'Earn Your Way to College',
    subtitle: 'Complete tasks. Earn Scholarship Points. Unlock real scholarships from colleges worldwide.',
    Visual: SlidingLogos,
  },
  {
    title: 'Short-Term Rewards, Long-Term Goals',
    subtitle: 'Every task you complete brings you closer to up to 100% scholarships. Start early, build your trajectory.',
    Visual: TrajectoryChart,
  },
  {
    title: 'Everything You Need in One Place',
    subtitle: 'AI-guided college prep checklist. All your documents organized. One-click applications when you\'re ready.',
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
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        scrollEnabled={true}
      >
        {screens.map((screen, index) => (
          <View key={index} className="flex-1 justify-center px-6">
            {/* Content as one unit - visual + text centered together */}
            <View className="items-center">
              {/* Visual */}
              <View className="mb-8">
                <screen.Visual />
              </View>

              {/* Text Content */}
              <Text className="text-gray-900 text-2xl font-inter-bold text-center mb-3">
                {screen.title}
              </Text>
              <Text className="text-gray-600 text-base font-inter-regular text-center leading-6 px-4">
                {screen.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </PagerView>

      {/* Bottom Button */}
      <View
        className="px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <LiquidButton
          onPress={handleNext}
          progress={getProgress()}
          label={getButtonLabel()}
        />
      </View>
    </View>
  );
}
