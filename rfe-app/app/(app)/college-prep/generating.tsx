import React, { useState, useEffect, useRef } from 'react';
import {
  useColorScheme,
  Animated,
  Easing,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { collegeReadinessApi } from '@/src/api/collegeReadiness.api';

const LOADING_MESSAGES = [
  'Analyzing your profile...',
  'Researching visa requirements...',
  'Checking language qualifications...',
  'Calculating financial requirements...',
  'Finding scholarship opportunities...',
  'Building your personalized checklist...',
  'Almost there...',
];

export default function GeneratingScreen() {
  const { token } = useAuth();
  const { startedAt } = useLocalSearchParams<{ startedAt: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [messageIndex, setMessageIndex] = useState(0);
  const [hasChecklist, setHasChecklist] = useState(false);

  // Parse the startedAt timestamp
  const generationStartedAt = startedAt ? parseInt(startedAt, 10) : Date.now();

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  // Gradient overlay opacity animations for smooth color shifting
  const gradientOpacity1 = useRef(new Animated.Value(0)).current;
  const gradientOpacity2 = useRef(new Animated.Value(0)).current;
  const gradientOpacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startPulseAnimation();
    startRotateAnimation();
    startFadeAnimation();
    startGradientOpacityAnimations();

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    // Check for checklist after a delay (giving AI time to generate)
    const checkInterval = setInterval(() => {
      checkForChecklist();
    }, 3000);

    // Initial check after 2 seconds
    const initialCheck = setTimeout(() => {
      checkForChecklist();
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(checkInterval);
      clearTimeout(initialCheck);
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startRotateAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startFadeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startGradientOpacityAnimations = () => {
    // Staggered opacity animations for smooth gradient color transitions
    // Gradient 1: Purple tint - fades in and out
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientOpacity1, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(gradientOpacity1, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gradient 2: Pink/Magenta tint - offset timing
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientOpacity2, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(gradientOpacity2, {
            toValue: 0,
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 2000);

    // Gradient 3: Teal tint - different offset
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientOpacity3, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(gradientOpacity3, {
            toValue: 0,
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 3000);
  };

  const checkForChecklist = async () => {
    if (!token || hasChecklist) return;

    try {
      const response = await collegeReadinessApi.getChecklist(token);
      if (response.success && response.data.hasChecklist && response.data.checklist) {
        // Check if this is a NEW checklist (generated after we started)
        const checklistGeneratedAt = new Date(response.data.checklist.lastGeneratedAt).getTime();

        if (checklistGeneratedAt > generationStartedAt) {
          setHasChecklist(true);
          // Small delay before navigating for smooth transition
          setTimeout(() => {
            router.replace('/(app)/college-prep');
          }, 500);
        }
      }
    } catch (error) {
      // Keep waiting
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Box className="flex-1">
      {/* Base gradient */}
      <LinearGradient
        colors={isDark ? ['#0f0a1e', '#1a1333', '#0f172a'] : ['#f8fafc', '#eef2ff', '#e0e7ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated gradient overlays - full screen, fading in/out for color shift effect */}
      {/* Purple/Violet overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity1 }]}>
        <LinearGradient
          colors={isDark
            ? ['rgba(139, 92, 246, 0.25)', 'rgba(139, 92, 246, 0.1)', 'transparent']
            : ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Pink/Magenta overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity2 }]}>
        <LinearGradient
          colors={isDark
            ? ['transparent', 'rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.15)']
            : ['transparent', 'rgba(236, 72, 153, 0.12)', 'rgba(236, 72, 153, 0.08)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Teal/Cyan overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity3 }]}>
        <LinearGradient
          colors={isDark
            ? ['rgba(6, 182, 212, 0.15)', 'transparent', 'rgba(6, 182, 212, 0.2)']
            : ['rgba(6, 182, 212, 0.1)', 'transparent', 'rgba(6, 182, 212, 0.12)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Content */}
      <VStack
        className="flex-1 items-center justify-center px-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {/* Animated Logo - Pulse and Rotate */}
        <Animated.View
          style={{
            transform: [
              { scale: pulseAnim },
              { rotate: rotation },
            ],
            marginBottom: 32,
          }}
        >
          <Box className="w-28 h-28 rounded-full bg-white/20 items-center justify-center">
            <Image
              source={require('@/assets/images/icons/app-icon-transparent-bg.png')}
              style={{ width: 72, height: 72 }}
              resizeMode="contain"
            />
          </Box>
        </Animated.View>

        {/* Title */}
        <Text
          className={`text-2xl font-inter-bold text-center mb-4 ${
            isDark ? 'text-white' : 'text-primary-900'
          }`}
        >
          Creating Your Checklist
        </Text>

        {/* Animated Message */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text
            className={`text-lg font-inter-medium text-center ${
              isDark ? 'text-white/80' : 'text-primary-700'
            }`}
          >
            {LOADING_MESSAGES[messageIndex]}
          </Text>
        </Animated.View>

        {/* Progress dots */}
        <Box className="flex-row mt-8" style={{ gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(139,92,246,0.5)',
                opacity: fadeAnim.interpolate({
                  inputRange: [0.3, 0.65, 1],
                  outputRange: i === 0 ? [1, 0.5, 1] : i === 1 ? [0.5, 1, 0.5] : [1, 0.5, 1],
                }),
              }}
            />
          ))}
        </Box>

        {/* Subtitle */}
        <Text
          className={`text-sm font-inter-regular text-center mt-8 px-4 ${
            isDark ? 'text-white/60' : 'text-primary-600'
          }`}
        >
          Our AI is crafting a personalized roadmap based on your profile and goals
        </Text>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({});
