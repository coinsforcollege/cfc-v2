import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

// Import SVG as component
import Sydney from '@/assets/images/icons/onbaording-college-logos/the-university-of-sydney-3.svg';

const LOGO_HEIGHT = 50;
const LOGO_MARGIN = 16;
const ANIMATION_DURATION = 15000;

// All logos (14 total: 5+5+4)
const allLogos = [
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/Harvard-Logo.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/stanford-university-logo.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/UC-Davis-Logo.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/USC-Logo.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/University_of_California,_Los_Angeles_logo.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/University_of_Montana_logo.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/University_of_Oxford.svg.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/Logo_for_Imperial_College_London.svg.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/the-university-of-melbourne-logo-png-transparent.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/The_Official_Logo_of_Shri_Ram_College_of_Commerce(SRCC).png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/SFSU-Identity_Wordmark_2-Line_Purple_rgb-1-1024x190.webp') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/fd896afc-5d8a-4015-9783-f38627a90fa3-cover.png') },
  { type: 'png', source: require('@/assets/images/icons/onbaording-college-logos/IIM_Bangalore_Logo.png') },
  { type: 'svg', Component: Sydney },
];

// Distribute: 5 + 5 + 4 = 14
const row1Logos = allLogos.slice(0, 5);
const row2Logos = allLogos.slice(5, 10);
const row3Logos = allLogos.slice(10, 14);

interface LogoItem {
  type: 'png' | 'svg';
  source?: any;
  Component?: React.FC<any>;
}

interface SlidingRowProps {
  logos: LogoItem[];
  direction: 'left' | 'right';
}

function SlidingRow({ logos, direction }: SlidingRowProps) {
  const translateX = useSharedValue(0);

  // Estimate width per logo (height * aspect ratio + margin)
  const logoWidth = LOGO_HEIGHT * 2.5 + LOGO_MARGIN;
  const setWidth = logos.length * logoWidth;

  useEffect(() => {
    // Start position for right-moving rows
    if (direction === 'right') {
      translateX.value = -setWidth;
    }

    const targetX = direction === 'left' ? -setWidth : 0;
    const startX = direction === 'left' ? 0 : -setWidth;

    translateX.value = startX;
    translateX.value = withRepeat(
      withTiming(targetX, {
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderLogo = (logo: LogoItem, index: number, setIndex: number) => {
    const key = `${setIndex}-${index}`;

    if (logo.type === 'svg' && logo.Component) {
      const SvgComponent = logo.Component;
      return (
        <View key={key} style={{ marginHorizontal: LOGO_MARGIN / 2 }}>
          <SvgComponent height={LOGO_HEIGHT} width={LOGO_HEIGHT * 2.5} />
        </View>
      );
    }

    return (
      <Image
        key={key}
        source={logo.source}
        style={{
          height: LOGO_HEIGHT,
          width: LOGO_HEIGHT * 2.5,
          marginHorizontal: LOGO_MARGIN / 2,
        }}
        resizeMode="contain"
      />
    );
  };

  // Render enough sets to fill screen and allow seamless loop
  const setsNeeded = Math.ceil(400 / (logos.length * logoWidth)) + 2;
  const sets = Array.from({ length: Math.max(setsNeeded, 4) }, (_, i) => i);

  return (
    <View className="overflow-hidden" style={{ height: LOGO_HEIGHT + 10 }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
      >
        {sets.map((setIndex) =>
          logos.map((logo, i) => renderLogo(logo, i, setIndex))
        )}
      </Animated.View>
    </View>
  );
}

export default function SlidingLogos() {
  return (
    <View className="gap-4">
      <SlidingRow logos={row1Logos} direction="left" />
      <SlidingRow logos={row2Logos} direction="right" />
      <SlidingRow logos={row3Logos} direction="left" />
    </View>
  );
}
