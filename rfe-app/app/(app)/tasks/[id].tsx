'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  Linking,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import {
  ChevronLeft,
  CircleHelp,
  BookOpen,
  Send,
  Play,
  ExternalLink,
  File,
  CheckCircle,
  Calendar,
} from '@/components/navigation/icons';
import { tasksApi, Task } from '@/src/api/tasks.api';
import config from '@/src/config';

const TABLET_BREAKPOINT = 768;

// Activity type config
const ACTIVITY_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bgColor: string; label: string }> = {
  'MCQ Quiz': { icon: CircleHelp, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)', label: 'Quiz' },
  'Learn': { icon: BookOpen, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)', label: 'Learn' },
  'Submission': { icon: Send, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', label: 'Submit' },
  'Script': { icon: Play, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', label: 'Script' },
};

// Fallback gradients
const FALLBACK_GRADIENTS: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
];

// Difficulty color classes - using tokens (green -> yellow -> orange -> red)
const DIFFICULTY_COLORS = {
  light: [
    'rgb(34, 197, 94)',   // 1-2: success-500
    'rgb(34, 197, 94)',
    'rgb(234, 179, 8)',   // 3-4: warning-500
    'rgb(234, 179, 8)',
    'rgb(249, 115, 22)',  // 5-6: orange
    'rgb(249, 115, 22)',
    'rgb(239, 68, 68)',   // 7-8: error-500
    'rgb(239, 68, 68)',
    'rgb(220, 38, 38)',   // 9-10: error-600
    'rgb(220, 38, 38)',
  ],
  dark: [
    'rgb(74, 222, 128)',  // 1-2: success-400
    'rgb(74, 222, 128)',
    'rgb(250, 204, 21)',  // 3-4: warning-400
    'rgb(250, 204, 21)',
    'rgb(251, 146, 60)',  // 5-6: orange-400
    'rgb(251, 146, 60)',
    'rgb(248, 113, 113)', // 7-8: error-400
    'rgb(248, 113, 113)',
    'rgb(239, 68, 68)',   // 9-10: error-500
    'rgb(239, 68, 68)',
  ],
};

// Theme colors
const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
    accent: 'rgb(99, 102, 241)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
    accent: 'rgb(129, 140, 248)',
  },
};

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-typography-900 font-inter-bold text-base mb-3">
      {title}
    </Text>
  );
}

// Difficulty Dots Component
function DifficultyDots({ difficulty, isDark }: { difficulty: number; isDark: boolean }) {
  const colorPalette = isDark ? DIFFICULTY_COLORS.dark : DIFFICULTY_COLORS.light;
  const difficultyColor = colorPalette[Math.min(difficulty - 1, 9)];

  return (
    <HStack className="items-center">
      <Box className="flex-row items-center">
        {[...Array(5)].map((_, i) => {
          const isActive = i < Math.ceil(difficulty / 2);
          return (
            <Box
              key={i}
              className="w-2 h-2 rounded-full mr-1"
              style={{
                backgroundColor: isActive
                  ? difficultyColor
                  : isDark ? 'rgb(82, 82, 82)' : 'rgb(200, 200, 200)',
              }}
            />
          );
        })}
      </Box>
      <Text className="text-typography-500 text-xs ml-1">
        {difficulty}/10
      </Text>
    </HStack>
  );
}

// Stat Card Component
function StatCard({ value, label, children }: { value?: string | number; label: string; children?: React.ReactNode }) {
  return (
    <VStack className="flex-1 items-center py-3">
      {children}
      {value !== undefined && (
        <Text className="text-typography-900 font-inter-bold text-lg">
          {value}
        </Text>
      )}
      <Text className="text-typography-500 text-xs text-center mt-1">
        {label}
      </Text>
    </VStack>
  );
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getById(id!);
      setTask(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const openURL = useCallback((url: string) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(fullUrl);
    }
  }, []);

  const handleMarkComplete = useCallback(() => {
    // TODO: Implement mark complete functionality
    console.log('Mark complete pressed for task:', id);
  }, [id]);

  if (loading) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <ActivityIndicator size="large" color={iconColors.accent} />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center px-6">
        <BookOpen size={64} color={iconColors.muted} />
        <Text className="text-typography-900 text-lg font-inter-semibold mt-4">
          Task not found
        </Text>
        <Text className="text-typography-500 text-sm text-center mt-2">
          {error || 'The task you are looking for does not exist.'}
        </Text>
        <Button className="mt-6" onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  const activityConfig = ACTIVITY_CONFIG[task.activity] || ACTIVITY_CONFIG['Learn'];
  const ActivityIcon = activityConfig.icon;

  // Build thumbnail URL
  const thumbnailUrl = task.thumbnail
    ? task.thumbnail.startsWith('http')
      ? task.thumbnail
      : `${config.apiUrl.replace('/api', '')}${task.thumbnail}`
    : null;

  const showGradient = !thumbnailUrl || thumbnailError;
  const gradientIndex = task._id.charCodeAt(0) % FALLBACK_GRADIENTS.length;
  const gradientColors = FALLBACK_GRADIENTS[gradientIndex];

  // Get images and documents from files
  const images = task.files.filter(f => f.type === 'image');
  const documents = task.files.filter(f => f.type === 'document');

  // Format expiry date
  const expiryDate = task.expiryDate ? new Date(task.expiryDate) : null;
  const isExpired = expiryDate && expiryDate < new Date();
  const formattedExpiry = expiryDate
    ? expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Cover Image Header */}
        <Box className="relative" style={{ height: isDesktop ? 280 : 200 }}>
          {showGradient ? (
            <ImageBackground
              source={require('@/assets/images/elegant-blue-wavy-pattern-background.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={[gradientColors[0], 'transparent', gradientColors[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', height: '100%', opacity: 0.7 }}
              />
            </ImageBackground>
          ) : (
            <Image
              source={{ uri: thumbnailUrl! }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setThumbnailError(true)}
            />
          )}

          {/* Gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.3, 1]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={24} color="white" strokeWidth={2.5} />
          </Pressable>

          {/* Activity Badge - Top Right */}
          <Box
            className="absolute px-3 py-1.5 rounded-lg flex-row items-center"
            style={{
              top: insets.top + 12,
              right: 16,
              backgroundColor: activityConfig.bgColor,
            }}
          >
            <ActivityIcon size={16} color={activityConfig.color} />
            <Text
              className="text-sm font-inter-bold ml-1.5"
              style={{ color: activityConfig.color }}
            >
              {task.activity}
            </Text>
          </Box>

          {/* Title & Points on Cover */}
          <Box
            className="absolute left-0 right-0 px-4"
            style={{ bottom: 16 }}
          >
            <Text
              className="text-white font-inter-black text-xl leading-tight mb-2"
              numberOfLines={3}
              style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
            >
              {task.title}
            </Text>

            {/* Points Badge - no icon */}
            {task.scholarshipPoints > 0 && (
              <HStack className="items-center">
                <Box className="bg-warning-500 px-3 py-1 rounded-full">
                  <Text className="text-white font-inter-bold text-sm">
                    {task.scholarshipPoints} Scholarship Points
                  </Text>
                </Box>
              </HStack>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Box className={`px-4 ${isDesktop ? 'max-w-[800px] self-center w-full' : ''}`}>
          {/* Quick Stats Row */}
          <HStack className="bg-background-100 rounded-2xl mt-4">
            <StatCard label="Difficulty">
              <DifficultyDots difficulty={task.difficulty} isDark={isDark} />
            </StatCard>
            <Box className="w-px bg-outline-200 my-3" />
            <StatCard label="Type">
              <HStack className="items-center mb-1">
                <ActivityIcon size={18} color={activityConfig.color} />
                <Text className="text-typography-900 font-inter-bold text-sm ml-1">
                  {activityConfig.label}
                </Text>
              </HStack>
            </StatCard>
            {task.requiresApproval && (
              <>
                <Box className="w-px bg-outline-200 my-3" />
                <StatCard label="Required">
                  <Text className="text-typography-900 font-inter-bold text-base mb-1">
                    Approval
                  </Text>
                </StatCard>
              </>
            )}
          </HStack>

          {/* Expiry Date */}
          {formattedExpiry && (
            <Box className={`mt-4 p-3 rounded-xl flex-row items-center ${isExpired ? 'bg-error-100' : 'bg-warning-100'}`}>
              <Calendar size={18} color={isExpired ? '#ef4444' : '#f59e0b'} />
              <Text className={`ml-2 text-sm font-inter-medium ${isExpired ? 'text-error-600' : 'text-warning-700'}`}>
                {isExpired ? 'Expired on' : 'Expires on'} {formattedExpiry}
              </Text>
            </Box>
          )}

          {/* Action Section - CTA Link as button */}
          {task.ctaLink && task.ctaLink.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Action" />
              <Pressable
                onPress={() => openURL(task.ctaLink!)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <ExternalLink size={18} color="white" />
                  <Text className="text-white font-inter-bold text-sm ml-2">
                    {task.ctaLabel || 'Open Resource'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </Box>
          )}

          {/* Description */}
          {task.description && (
            <Box className="mt-6">
              <SectionHeader title="Description" />
              <Text className="text-typography-600 text-sm leading-relaxed">
                {task.description}
              </Text>
            </Box>
          )}

          {/* Categories, Topics & Grades - Flexible Layout */}
          {(task.categories.length > 0 || (task.topic && task.topic.length > 0) || task.grade.length > 0) && (
            <Box className="mt-6">
              <SectionHeader title="Details" />
              <HStack className="flex-wrap items-center gap-2">
                {/* Categories */}
                {task.categories.length > 0 && (
                  <>
                    <Text className="text-typography-500 text-xs font-inter-medium">
                      Category:
                    </Text>
                    {task.categories.map((cat) => (
                      <Box
                        key={cat._id}
                        className="px-3 py-1.5 rounded-full bg-primary-100"
                      >
                        <Text className="text-primary-700 text-sm font-inter-medium">
                          {cat.name}
                        </Text>
                      </Box>
                    ))}
                  </>
                )}

                {/* Topics */}
                {task.topic && task.topic.length > 0 && (
                  <>
                    <Text className="text-typography-500 text-xs font-inter-medium ml-1">
                      Topics:
                    </Text>
                    {task.topic.map((topic, index) => (
                      <Box
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-background-100 border border-outline-200"
                      >
                        <Text className="text-typography-700 text-sm font-inter-medium">
                          #{topic}
                        </Text>
                      </Box>
                    ))}
                  </>
                )}

                {/* Grade Levels */}
                {task.grade.length > 0 && (
                  <>
                    <Text className="text-typography-500 text-xs font-inter-medium ml-1">
                      Grades:
                    </Text>
                    {task.grade.map((grade, index) => (
                      <Box
                        key={index}
                        className="w-8 h-8 rounded-lg bg-background-100 items-center justify-center"
                      >
                        <Text className="text-typography-700 text-xs font-inter-bold">
                          {grade === 'K' ? 'K' : grade}
                        </Text>
                      </Box>
                    ))}
                  </>
                )}
              </HStack>
            </Box>
          )}

          {/* Images */}
          {images.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Images" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {images.map((file, index) => {
                  const imageUrl = file.url.startsWith('http')
                    ? file.url
                    : `${config.apiUrl.replace('/api', '')}${file.url}`;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => openURL(imageUrl)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                    >
                      <Box className="rounded-xl overflow-hidden border border-outline-100">
                        <Image
                          source={{ uri: imageUrl }}
                          style={{ width: 200, height: 150 }}
                          resizeMode="cover"
                        />
                      </Box>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Box>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Documents" />
              <VStack space="sm">
                {documents.map((file, index) => {
                  const docUrl = file.url.startsWith('http')
                    ? file.url
                    : `${config.apiUrl.replace('/api', '')}${file.url}`;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => openURL(docUrl)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                    >
                      <Box className="bg-background-100 rounded-xl p-3 flex-row items-center">
                        <Box className="w-10 h-10 rounded-lg bg-error-100 items-center justify-center mr-3">
                          <File size={20} color="#ef4444" />
                        </Box>
                        <VStack className="flex-1">
                          <Text className="text-typography-900 font-inter-medium text-sm" numberOfLines={1}>
                            {file.name}
                          </Text>
                          <Text className="text-typography-500 text-xs">
                            Tap to open
                          </Text>
                        </VStack>
                        <ExternalLink size={18} color={iconColors.muted} />
                      </Box>
                    </Pressable>
                  );
                })}
              </VStack>
            </Box>
          )}
        </Box>
      </ScrollView>

      {/* Floating Mark Complete Button - no background box */}
      <Box
        className="absolute left-0 right-0 px-4"
        style={{
          bottom: Math.max(insets.bottom, 16) + 16,
        }}
      >
        <Box
          style={{
            maxWidth: isDesktop ? 800 : undefined,
            alignSelf: isDesktop ? 'center' : undefined,
            width: '100%',
          }}
        >
          <Pressable
            onPress={handleMarkComplete}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-white font-inter-bold text-base">
                Mark Complete
              </Text>
              {task.scholarshipPoints > 0 && (
                <Text className="text-white/80 font-inter-bold text-sm ml-2">
                  +{task.scholarshipPoints} SP
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}
