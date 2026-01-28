import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LiquidButtonProps {
  onPress: () => void;
  progress: number; // 0.33, 0.66, or 1
  label: string;
}

export default function LiquidButton({ onPress, progress, label }: LiquidButtonProps) {
  const fillWidth = useSharedValue(progress);

  useEffect(() => {
    fillWidth.value = withTiming(progress, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => {
    return {
      width: `${fillWidth.value * 100}%`,
    };
  });

  // Determine text color based on fill level (white when more than half filled)
  const textColor = progress > 0.5 ? 'text-white' : 'text-primary-500';

  return (
    <Pressable
      onPress={onPress}
      className="w-full h-14 rounded-full overflow-hidden border-2 border-primary-500 bg-white"
    >
      {/* Gradient Fill */}
      <Animated.View
        style={[fillStyle, { position: 'absolute', top: 0, left: 0, bottom: 0 }]}
      >
        <LinearGradient
          colors={['#5164f6', '#a855f7', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Text */}
      <View className="flex-1 items-center justify-center">
        <Text className={`font-inter-semibold text-base ${textColor}`}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
