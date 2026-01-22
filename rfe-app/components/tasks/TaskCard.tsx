'use client';
import React, { useCallback, useState } from 'react';
import { Image, Pressable, useColorScheme, View } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '@/src/api/tasks.api';
import { CircleHelp, BookOpen, Send, Play } from '@/components/navigation/icons';
import config from '@/src/config';

// Activity type icons and colors - white text on 60% opaque colored backgrounds
const ACTIVITY_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bgColor: string }> = {
  'MCQ Quiz': { icon: CircleHelp, color: '#ffffff', bgColor: 'rgba(139, 92, 246, 0.6)' },
  'Learn': { icon: BookOpen, color: '#ffffff', bgColor: 'rgba(59, 130, 246, 0.6)' },
  'Submission': { icon: Send, color: '#ffffff', bgColor: 'rgba(16, 185, 129, 0.6)' },
  'Script': { icon: Play, color: '#ffffff', bgColor: 'rgba(245, 158, 11, 0.6)' },
};

// Fallback gradients for thumbnails
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
    'rgb(34, 197, 94)',   //
    'rgb(234, 179, 8)',   // 3-4: warning-500
    'rgb(234, 179, 8)',   //
    'rgb(249, 115, 22)',  // 5-6: orange
    'rgb(249, 115, 22)',  //
    'rgb(239, 68, 68)',   // 7-8: error-500
    'rgb(239, 68, 68)',   //
    'rgb(220, 38, 38)',   // 9-10: error-600
    'rgb(220, 38, 38)',   //
  ],
  dark: [
    'rgb(74, 222, 128)',  // 1-2: success-400
    'rgb(74, 222, 128)',  //
    'rgb(250, 204, 21)',  // 3-4: warning-400
    'rgb(250, 204, 21)',  //
    'rgb(251, 146, 60)',  // 5-6: orange-400
    'rgb(251, 146, 60)',  //
    'rgb(248, 113, 113)', // 7-8: error-400
    'rgb(248, 113, 113)', //
    'rgb(239, 68, 68)',   // 9-10: error-500
    'rgb(239, 68, 68)',   //
  ],
};

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = useCallback(() => {
    router.push(`/(app)/tasks/${task._id}`);
  }, [task._id]);

  const activityConfig = ACTIVITY_CONFIG[task.activity] || ACTIVITY_CONFIG['Learn'];
  const ActivityIcon = activityConfig.icon;

  // Build thumbnail URL
  const thumbnailUrl = task.thumbnail
    ? task.thumbnail.startsWith('http')
      ? task.thumbnail
      : `${config.apiUrl.replace('/api', '')}${task.thumbnail}`
    : null;

  const showGradient = !thumbnailUrl || thumbnailError;
  const gradientColors = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  // Get first letter of title for fallback
  const titleInitial = task.title.charAt(0).toUpperCase();

  // Get difficulty color
  const difficultyColorPalette = isDark ? DIFFICULTY_COLORS.dark : DIFFICULTY_COLORS.light;
  const difficultyColor = difficultyColorPalette[Math.min(task.difficulty - 1, 9)];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        flex: 1,
      })}
    >
      <Box
        className="bg-background-0 rounded-2xl overflow-hidden border border-outline-100 shadow-hard-5"
        style={{ height: 200 }}
      >
        {/* Thumbnail - 45% */}
        <Box className="relative" style={{ height: 90 }}>
          {showGradient ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-white/60 font-inter-black text-3xl">
                {titleInitial}
              </Text>
            </LinearGradient>
          ) : (
            <Image
              source={{ uri: thumbnailUrl! }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setThumbnailError(true)}
            />
          )}

          {/* Gradient overlay for text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            locations={[0.3, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
            }}
          />

          {/* Activity Badge - more opaque */}
          <Box
            className="absolute top-2 left-2 px-2 py-1 rounded-lg flex-row items-center"
            style={{ backgroundColor: activityConfig.bgColor }}
          >
            <ActivityIcon size={12} color={activityConfig.color} />
            <Text
              className="text-2xs font-inter-semibold ml-1"
              style={{ color: activityConfig.color }}
            >
              {task.activity}
            </Text>
          </Box>

        </Box>

        {/* Content - 55% */}
        <Box className="px-3 pt-2.5 pb-2 flex-1">
          {/* Title */}
          <Text
            className="text-typography-900 font-inter-bold text-sm leading-tight"
            numberOfLines={2}
            style={{ minHeight: 36 }}
          >
            {task.title}
          </Text>

          {/* Categories - single row only, no wrapping */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 6,
              overflow: 'hidden',
              height: 22,
            }}
          >
            {task.categories.slice(0, 3).map((cat, idx) => (
              <Box
                key={cat._id}
                className="px-1.5 py-0.5 rounded bg-background-200 mr-1"
              >
                <Text
                  className="text-2xs font-inter-medium text-typography-600"
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </Box>
            ))}
          </View>

          {/* Difficulty indicator with color gradient + SP on right */}
          <HStack className="items-center justify-between mt-auto pt-1">
            <HStack className="items-center">
              <Box className="flex-row items-center">
                {[...Array(5)].map((_, i) => {
                  const isActive = i < Math.ceil(task.difficulty / 2);
                  return (
                    <Box
                      key={i}
                      className="w-1.5 h-1.5 rounded-full mr-0.5"
                      style={{
                        backgroundColor: isActive
                          ? difficultyColor
                          : isDark ? 'rgb(64, 64, 64)' : 'rgb(229, 229, 229)',
                      }}
                    />
                  );
                })}
              </Box>
              <Text className="text-2xs text-typography-400 ml-1.5">
                Lvl {task.difficulty}
              </Text>
            </HStack>
            {task.scholarshipPoints > 0 && (
              <Text className="text-2xs font-inter-semibold text-warning-600">
                {task.scholarshipPoints} SP
              </Text>
            )}
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );
}

export default TaskCard;
