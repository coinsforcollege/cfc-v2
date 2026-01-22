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
  View,
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
  Coins,
  CircleHelp,
  BookOpen,
  Send,
  Play,
  Clock,
  Star,
  ExternalLink,
  File,
  ImageIcon,
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

// Stat Card Component
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color?: string }) {
  return (
    <VStack className="flex-1 items-center py-3">
      <Box className="mb-1">
        {icon}
      </Box>
      <Text className="text-typography-900 font-inter-bold text-lg" style={color ? { color } : undefined}>
        {value}
      </Text>
      <Text className="text-typography-500 text-xs text-center">
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
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Cover Image Header */}
        <Box className="relative" style={{ height: isDesktop ? 280 : 200 }}>
          {showGradient ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <ActivityIcon size={64} color="rgba(255,255,255,0.4)" />
            </LinearGradient>
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

            {/* Points Badge */}
            {task.scholarshipPoints > 0 && (
              <HStack className="items-center">
                <Box className="bg-warning-500 px-3 py-1 rounded-full flex-row items-center">
                  <Coins size={14} color="white" />
                  <Text className="text-white font-inter-bold text-sm ml-1">
                    {task.scholarshipPoints} Points
                  </Text>
                </Box>
              </HStack>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Box className={`px-4 ${isDesktop ? 'max-w-[800px] self-center w-full' : ''}`}>
          {/* Custom CTA Link - Shown prominently after title */}
          {task.ctaLink && task.ctaLink.length > 0 && (
            <Pressable
              onPress={() => openURL(task.ctaLink!)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Box className="mt-4 bg-primary-50 border border-primary-200 rounded-xl p-4 flex-row items-center">
                <Box className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center mr-3">
                  <ExternalLink size={20} color="white" />
                </Box>
                <VStack className="flex-1">
                  <Text className="text-primary-700 font-inter-bold text-sm">
                    {task.ctaLabel || 'View Resource'}
                  </Text>
                  <Text className="text-primary-500 text-xs" numberOfLines={1}>
                    {task.ctaLink}
                  </Text>
                </VStack>
                <ChevronLeft
                  size={20}
                  color={iconColors.accent}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </Box>
            </Pressable>
          )}

          {/* Quick Stats Row */}
          <HStack className="bg-background-100 rounded-2xl mt-4">
            <StatCard
              icon={<Star size={18} color={iconColors.accent} />}
              value={`${task.difficulty}/10`}
              label="Difficulty"
            />
            <Box className="w-px bg-outline-200 my-3" />
            <StatCard
              icon={<ActivityIcon size={18} color={activityConfig.color} />}
              value={activityConfig.label}
              label="Type"
            />
            {task.requiresApproval && (
              <>
                <Box className="w-px bg-outline-200 my-3" />
                <StatCard
                  icon={<CheckCircle size={18} color="#10b981" />}
                  value="Yes"
                  label="Approval"
                />
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

          {/* Description */}
          {task.description && (
            <Box className="mt-6">
              <SectionHeader title="Description" />
              <Text className="text-typography-600 text-sm leading-relaxed">
                {task.description}
              </Text>
            </Box>
          )}

          {/* Categories */}
          {task.categories.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Categories" />
              <HStack className="flex-wrap gap-2">
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
              </HStack>
            </Box>
          )}

          {/* Topics */}
          {task.topic && task.topic.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Topics" />
              <HStack className="flex-wrap gap-2">
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
              </HStack>
            </Box>
          )}

          {/* Grade Levels */}
          {task.grade.length > 0 && (
            <Box className="mt-6">
              <SectionHeader title="Grade Levels" />
              <HStack className="flex-wrap gap-2">
                {task.grade.map((grade, index) => (
                  <Box
                    key={index}
                    className="w-9 h-9 rounded-lg bg-background-100 items-center justify-center"
                  >
                    <Text className="text-typography-700 text-sm font-inter-bold">
                      {grade === 'K' ? 'K' : grade}
                    </Text>
                  </Box>
                ))}
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

      {/* Sticky Mark Complete Button */}
      <Box
        className="absolute left-0 right-0 bg-background-0 border-t border-outline-100 px-4"
        style={{
          bottom: 0,
          paddingBottom: Math.max(insets.bottom, 16),
          paddingTop: 12,
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
              }}
            >
              <CheckCircle size={22} color="white" />
              <Text className="text-white font-inter-bold text-base ml-2">
                Mark Complete
              </Text>
              {task.scholarshipPoints > 0 && (
                <Box className="bg-white/20 px-2 py-0.5 rounded-full ml-2 flex-row items-center">
                  <Coins size={12} color="white" />
                  <Text className="text-white font-inter-bold text-xs ml-1">
                    +{task.scholarshipPoints}
                  </Text>
                </Box>
              )}
            </LinearGradient>
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}
