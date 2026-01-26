import React, { useEffect } from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Bot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(View);

export function HugoAIFab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Animation values
  const scale = useSharedValue(1);
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    // Pulsing scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );

    // Shimmer animation
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerPosition.value, [0, 1], [-200, 200]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <AnimatedPressable
      style={[
        {
          position: 'absolute',
          bottom: 100,
          right: 20,
          borderRadius: 28,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={() => router.push('/(app)/hugo-chat')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <LinearGradient
          colors={['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            },
            shimmerStyle,
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 200, height: '100%' }}
          />
        </Animated.View>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            zIndex: 1,
          }}
        >
          <Bot size={18} color="#ffffff" strokeWidth={2} />
        </View>
        <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold', zIndex: 1 }}>
          Hugo AI
        </Text>
      </Pressable>
    </AnimatedPressable>
  );
}
