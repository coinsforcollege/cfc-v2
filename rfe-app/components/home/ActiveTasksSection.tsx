'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, useColorScheme, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { tasksApi, Task } from '@/src/api/tasks.api';
import { ChevronRight, CircleHelp, BookOpen, Send, Play } from 'lucide-react-native';
import config from '@/src/config';

// Activity type icons and colors
const ACTIVITY_CONFIG: Record<string, { icon: React.ComponentType<any>; gradient: [string, string]; lightBg: string }> = {
  'MCQ Quiz': { icon: CircleHelp, gradient: ['#8b5cf6', '#6366f1'], lightBg: '#f3e8ff' },
  'Learn': { icon: BookOpen, gradient: ['#3b82f6', '#2563eb'], lightBg: '#dbeafe' },
  'Submission': { icon: Send, gradient: ['#10b981', '#059669'], lightBg: '#d1fae5' },
  'Script': { icon: Play, gradient: ['#f59e0b', '#d97706'], lightBg: '#fef3c7' },
};

// Difficulty color based on level
function getDifficultyColor(difficulty: number, isDark: boolean): string {
  if (difficulty <= 2) return isDark ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)';
  if (difficulty <= 4) return isDark ? 'rgb(250, 204, 21)' : 'rgb(234, 179, 8)';
  if (difficulty <= 6) return isDark ? 'rgb(251, 146, 60)' : 'rgb(249, 115, 22)';
  if (difficulty <= 8) return isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)';
  return isDark ? 'rgb(239, 68, 68)' : 'rgb(220, 38, 38)';
}

function SkeletonTaskCard() {
  return (
    <Box className="bg-background-0 rounded-2xl p-4 mb-3 border border-outline-100">
      <HStack className="items-center">
        <Skeleton width={56} height={56} borderRadius={16} />
        <VStack className="flex-1 ml-4">
          <Skeleton width={180} height={16} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width={120} height={12} borderRadius={4} style={{ marginBottom: 6 }} />
          <HStack className="items-center">
            <Skeleton width={60} height={12} borderRadius={4} />
            <Skeleton width={40} height={12} borderRadius={4} style={{ marginLeft: 12 }} />
          </HStack>
        </VStack>
        <Skeleton width={24} height={24} borderRadius={12} />
      </HStack>
    </Box>
  );
}

interface TaskCardProps {
  task: Task;
  index: number;
  isDark: boolean;
}

function HorizontalTaskCard({ task, index, isDark }: TaskCardProps) {
  const activityConfig = ACTIVITY_CONFIG[task.activity] || ACTIVITY_CONFIG['Learn'];
  const ActivityIcon = activityConfig.icon;
  const difficultyColor = getDifficultyColor(task.difficulty, isDark);

  // Build thumbnail URL if available
  const hasThumbnail = task.thumbnail && task.thumbnail.length > 5;
  const thumbnailUrl = hasThumbnail
    ? (task.thumbnail!.startsWith('http')
        ? task.thumbnail
        : `${config.apiUrl.replace('/api', '')}${task.thumbnail}`)
    : null;

  const handlePress = useCallback(() => {
    router.push(`/(app)/tasks/${task._id}`);
  }, [task._id]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      <Box className="bg-background-0 rounded-2xl p-4 mb-3 border border-outline-100 shadow-sm">
        <HStack className="items-center">
          {/* Task Image or Icon Fallback */}
          <Box
            className="w-14 h-14 rounded-2xl items-center justify-center overflow-hidden"
          >
            {thumbnailUrl ? (
              <Image
                source={{ uri: thumbnailUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <>
                <LinearGradient
                  colors={activityConfig.gradient}
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
                <ActivityIcon size={26} color="white" strokeWidth={1.5} />
              </>
            )}
          </Box>

          {/* Content */}
          <VStack className="flex-1 ml-4 mr-2">
            <Text
              className="text-typography-900 font-inter-bold text-base leading-tight"
              numberOfLines={2}
            >
              {task.title}
            </Text>

            {/* Category */}
            {task.categories.length > 0 && (
              <Text
                className="text-typography-500 text-xs font-inter-medium mt-1"
                numberOfLines={1}
              >
                {task.categories[0].name}
              </Text>
            )}

            {/* Bottom row: Difficulty + SP */}
            <HStack className="items-center mt-2">
              {/* Difficulty indicator */}
              <HStack className="items-center">
                <Box className="flex-row items-center mr-1.5">
                  {[...Array(5)].map((_, i) => {
                    const isActive = i < Math.ceil(task.difficulty / 2);
                    return (
                      <Box
                        key={i}
                        className="w-1.5 h-1.5 rounded-full mr-0.5"
                        style={{
                          backgroundColor: isActive
                            ? difficultyColor
                            : isDark ? 'rgb(82, 82, 82)' : 'rgb(200, 200, 200)',
                        }}
                      />
                    );
                  })}
                </Box>
                <Text className="text-2xs text-typography-400">
                  Lvl {task.difficulty}
                </Text>
              </HStack>

              {/* SP Badge */}
              {task.scholarshipPoints > 0 && (
                <Box className="bg-warning-100 px-2 py-0.5 rounded-full ml-3">
                  <Text className="text-2xs font-inter-bold text-warning-700">
                    +{task.scholarshipPoints} SP
                  </Text>
                </Box>
              )}
            </HStack>
          </VStack>

          {/* Arrow */}
          <ChevronRight size={20} color={isDark ? '#a1a1aa' : '#9ca3af'} />
        </HStack>
      </Box>
    </Pressable>
  );
}

export function ActiveTasksSection() {
  const { token } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Get 3 active tasks, excluding completed ones if token provided
      const response = await tasksApi.getAll({ limit: 3 }, token || undefined);
      if (response.success && response.data) {
        setTasks(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show section if no tasks
  if (!loading && tasks.length === 0) {
    return null;
  }

  return (
    <Box className="mb-6 px-4">
      {/* Section Header */}
      <HStack className="mb-3 items-center justify-between">
        <Text className="text-typography-900 font-inter-regular text-lg tracking-tight">
          Active Tasks
        </Text>
        <Pressable
          onPress={() => router.push('/(app)/tasks')}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <HStack className="items-center">
            <Text className="text-sm font-inter-bold uppercase tracking-wider text-primary-600">
              View All
            </Text>
            <ChevronRight size={16} color="#4f46e5" />
          </HStack>
        </Pressable>
      </HStack>

      {/* Task Cards */}
      {loading ? (
        <>
          <SkeletonTaskCard />
          <SkeletonTaskCard />
          <SkeletonTaskCard />
        </>
      ) : (
        tasks.map((task, index) => (
          <HorizontalTaskCard
            key={task._id}
            task={task}
            index={index}
            isDark={isDark}
          />
        ))
      )}
    </Box>
  );
}

export default ActiveTasksSection;
