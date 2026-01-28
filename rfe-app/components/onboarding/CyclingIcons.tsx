import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

// Import all 10 SVG icons from the folder
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

// All 10 icons array
const ALL_ICONS = [
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
const GAP = 32;
const CHANGE_INTERVAL = 1000;
const FADE_DURATION = 300;

interface IconSlotProps {
  iconIndex: number;
  changeKey: number;
}

function IconSlot({ iconIndex, changeKey }: IconSlotProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (changeKey > 0) {
      // Smooth fade and scale transition
      opacity.value = 0;
      scale.value = 0.8;
      opacity.value = withTiming(1, {
        duration: FADE_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      scale.value = withTiming(1, {
        duration: FADE_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [changeKey]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = ALL_ICONS[iconIndex];

  if (!IconComponent) {
    return (
      <View
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
      />
    );
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: ICON_SIZE,
          height: ICON_SIZE,
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
  // 6 slots showing icons by index, plus a change counter for each slot
  const [slots, setSlots] = useState([
    { iconIndex: 0, changeKey: 0 },
    { iconIndex: 1, changeKey: 0 },
    { iconIndex: 2, changeKey: 0 },
    { iconIndex: 3, changeKey: 0 },
    { iconIndex: 4, changeKey: 0 },
    { iconIndex: 5, changeKey: 0 },
  ]);

  const getRandomNewIcon = useCallback((currentSlots: typeof slots, slotToChange: number) => {
    // Get all icon indices currently displayed
    const currentIcons = currentSlots.map(s => s.iconIndex);

    // Get available icons (not currently displayed)
    const availableIcons = ALL_ICONS
      .map((_, i) => i)
      .filter((i) => !currentIcons.includes(i));

    if (availableIcons.length === 0) {
      // Fallback: pick any icon different from current slot
      const currentIcon = currentSlots[slotToChange].iconIndex;
      const otherIcons = ALL_ICONS.map((_, i) => i).filter(i => i !== currentIcon);
      return otherIcons[Math.floor(Math.random() * otherIcons.length)];
    }

    return availableIcons[Math.floor(Math.random() * availableIcons.length)];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random slot to change (0-5)
      const randomSlot = Math.floor(Math.random() * 6);

      setSlots((currentSlots) => {
        const newIcon = getRandomNewIcon(currentSlots, randomSlot);
        const newSlots = [...currentSlots];
        newSlots[randomSlot] = {
          iconIndex: newIcon,
          changeKey: currentSlots[randomSlot].changeKey + 1,
        };
        return newSlots;
      });
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
          width: (ICON_SIZE * 3) + (GAP * 2),
          gap: GAP,
        }}
      >
        {slots.map((slot, index) => (
          <IconSlot
            key={index}
            iconIndex={slot.iconIndex}
            changeKey={slot.changeKey}
          />
        ))}
      </View>
    </View>
  );
}
