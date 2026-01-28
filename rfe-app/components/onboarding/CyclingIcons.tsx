import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

// Import all SVG icons
import AbacusIcon from '@/assets/images/icons/onboarding-feature-icons/abacus-book-education-learning-school-study-svgrepo-com.svg';
import AvatarIcon from '@/assets/images/icons/onboarding-feature-icons/avatar-card-education-svgrepo-com.svg';
import DialogIcon from '@/assets/images/icons/onboarding-feature-icons/dialogflow-svgrepo-com.svg';
import GraphIcon from '@/assets/images/icons/onboarding-feature-icons/graph-svgrepo-com.svg';
import JapaneseIcon from '@/assets/images/icons/onboarding-feature-icons/japanese-not-free-of-charge-button-svgrepo-com.svg';
import NodebotsIcon from '@/assets/images/icons/onboarding-feature-icons/nodebots-svgrepo-com.svg';
import PassIcon from '@/assets/images/icons/onboarding-feature-icons/pass-sports-and-competition-svgrepo-com.svg';
import PosterIcon from '@/assets/images/icons/onboarding-feature-icons/poster-learn-communication-svgrepo-com.svg';
import TaskListIcon from '@/assets/images/icons/onboarding-feature-icons/task-list-svgrepo-com.svg';
import TravelIcon from '@/assets/images/icons/onboarding-feature-icons/travel-holiday-vacation-14-svgrepo-com.svg';

const allIcons = [
  AbacusIcon,
  AvatarIcon,
  DialogIcon,
  GraphIcon,
  JapaneseIcon,
  NodebotsIcon,
  PassIcon,
  PosterIcon,
  TaskListIcon,
  TravelIcon,
];

const ICON_SIZE = 50;
const GAP = 24;
const CHANGE_INTERVAL = 1000;
const FADE_DURATION = 200;

interface IconSlotProps {
  iconIndex: number;
  isChanging: boolean;
  onFadeOutComplete: () => void;
}

function IconSlot({ iconIndex, isChanging, onFadeOutComplete }: IconSlotProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isChanging) {
      opacity.value = withSequence(
        withTiming(0, { duration: FADE_DURATION, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: FADE_DURATION, easing: Easing.in(Easing.ease) })
      );

      // Notify parent when fade out is complete (halfway through animation)
      const timeout = setTimeout(() => {
        onFadeOutComplete();
      }, FADE_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [isChanging]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const IconComponent = allIcons[iconIndex];

  if (!IconComponent) {
    return null;
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: ICON_SIZE + GAP,
          height: ICON_SIZE + GAP,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <IconComponent width={ICON_SIZE} height={ICON_SIZE} />
    </Animated.View>
  );
}

export default function CyclingIcons() {
  // Initial state: 6 slots with different icons
  const [slotIcons, setSlotIcons] = useState([0, 1, 2, 3, 4, 5]);
  const [changingSlot, setChangingSlot] = useState<number | null>(null);
  const pendingIconRef = useRef<number | null>(null);

  const getRandomNewIcon = useCallback((currentIcons: number[]) => {
    // Get icons not currently displayed
    const availableIcons = allIcons
      .map((_, i) => i)
      .filter((i) => !currentIcons.includes(i));

    if (availableIcons.length === 0) {
      // All icons are displayed, just pick any random one
      return Math.floor(Math.random() * allIcons.length);
    }

    return availableIcons[Math.floor(Math.random() * availableIcons.length)];
  }, []);

  const handleFadeOutComplete = useCallback((slotIndex: number) => {
    if (pendingIconRef.current !== null) {
      setSlotIcons((prev) => {
        const newIcons = [...prev];
        newIcons[slotIndex] = pendingIconRef.current!;
        return newIcons;
      });
      pendingIconRef.current = null;
    }

    // Reset changing state after full animation
    setTimeout(() => {
      setChangingSlot(null);
    }, FADE_DURATION);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random slot to change
      const randomSlot = Math.floor(Math.random() * 6);

      setSlotIcons((currentIcons) => {
        // Pick new icon for this slot
        const newIcon = getRandomNewIcon(currentIcons);
        pendingIconRef.current = newIcon;
        return currentIcons;
      });

      setChangingSlot(randomSlot);
    }, CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [getRandomNewIcon]);

  return (
    <View className="items-center">
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: (ICON_SIZE + GAP) * 3,
          gap: GAP,
        }}
      >
        {slotIcons.map((iconIndex, slotIndex) => (
          <IconSlot
            key={slotIndex}
            iconIndex={iconIndex}
            isChanging={changingSlot === slotIndex}
            onFadeOutComplete={() => handleFadeOutComplete(slotIndex)}
          />
        ))}
      </View>
    </View>
  );
}
