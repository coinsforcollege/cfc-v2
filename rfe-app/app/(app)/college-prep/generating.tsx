import React, { useState, useEffect, useRef } from 'react';
import {
  Pressable,
  Platform,
  useColorScheme,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { collegeReadinessApi } from '@/src/api/collegeReadiness.api';
import { Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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
  const beamPosition = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startBeamAnimation();
    startPulseAnimation();
    startFadeAnimation();

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

  const startBeamAnimation = () => {
    Animated.loop(
      Animated.timing(beamPosition, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
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

  // Calculate beam translation for border effect
  const beamTranslateX = beamPosition.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, width - 100, width - 100, 0, 0],
  });

  const beamTranslateY = beamPosition.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 0, height - 200, height - 200, 0],
  });

  return (
    <Box className="flex-1">
      <LinearGradient
        colors={isDark ? ['#1e1b4b', '#312e81', '#4c1d95'] : ['#eef2ff', '#e0e7ff', '#c7d2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Animated border beam */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 100,
            height: 4,
            borderRadius: 2,
            transform: [
              { translateX: beamTranslateX },
              { translateY: beamTranslateY },
            ],
          }}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 2 }}
          />
        </Animated.View>

        {/* Content */}
        <VStack
          className="flex-1 items-center justify-center px-8"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          {/* Animated Icon */}
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
              marginBottom: 32,
            }}
          >
            <Box className="w-24 h-24 rounded-full bg-white/20 items-center justify-center">
              <Sparkles size={48} color={isDark ? '#fff' : '#8B5CF6'} />
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
                    inputRange: [0, 0.5, 1],
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

        {/* Decorative elements */}
        <Box
          className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20"
          style={{ backgroundColor: '#EC4899' }}
        />
        <Box
          className="absolute bottom-40 right-10 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: '#8B5CF6' }}
        />
        <Box
          className="absolute top-1/3 right-20 w-16 h-16 rounded-full opacity-20"
          style={{ backgroundColor: '#10B981' }}
        />
      </LinearGradient>
    </Box>
  );
}
