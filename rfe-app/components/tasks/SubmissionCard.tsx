'use client';
import React, { useCallback } from 'react';
import { Pressable, useColorScheme, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import {
  Clock,
  CheckCheck,
  AlertCircle,
  CircleHelp,
  BookOpen,
  Send,
  Play,
  File,
  Image as ImageIcon,
  Video,
} from '@/components/navigation/icons';
import { TaskSubmission } from '@/src/api/tasks.api';
import config from '@/src/config';

// Activity type icons and colors
const ACTIVITY_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string }> = {
  'MCQ Quiz': { icon: CircleHelp, color: '#8b5cf6' },
  'Learn': { icon: BookOpen, color: '#3b82f6' },
  'Submission': { icon: Send, color: '#10b981' },
  'Script': { icon: Play, color: '#f59e0b' },
};

// Fallback gradients for thumbnails
const FALLBACK_GRADIENTS: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
];

interface SubmissionCardProps {
  submission: TaskSubmission;
  index: number;
}

export function SubmissionCard({ submission, index }: SubmissionCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = useCallback(() => {
    router.push(`/(app)/tasks/${submission.task._id}`);
  }, [submission.task._id]);

  const task = submission.task;
  const activityConfig = ACTIVITY_CONFIG[task.activity] || ACTIVITY_CONFIG['Learn'];
  const ActivityIcon = activityConfig.icon;

  // Build thumbnail URL
  const thumbnailUrl = task.thumbnail
    ? task.thumbnail.startsWith('http')
      ? task.thumbnail
      : `${config.apiUrl.replace('/api', '')}${task.thumbnail}`
    : null;

  const gradientColors = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  // Status config
  const statusConfig = {
    pending: {
      icon: Clock,
      color: isDark ? '#fcd34d' : '#b45309',
      bgColor: isDark ? 'rgba(217, 119, 6, 0.2)' : 'rgba(254, 243, 199, 1)',
      label: 'In Review',
    },
    approved: {
      icon: CheckCheck,
      color: isDark ? '#86efac' : '#166534',
      bgColor: isDark ? 'rgba(22, 101, 52, 0.3)' : 'rgba(220, 252, 231, 1)',
      label: 'Completed',
    },
    rejected: {
      icon: AlertCircle,
      color: isDark ? '#fca5a5' : '#dc2626',
      bgColor: isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(254, 226, 226, 1)',
      label: 'Rejected',
    },
  };

  const status = statusConfig[submission.status];
  const StatusIcon = status.icon;

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get file counts
  const imageCount = submission.files.filter(f => f.type === 'image').length;
  const videoCount = submission.files.filter(f => f.type === 'video').length;
  const docCount = submission.files.filter(f => f.type === 'document').length;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Box
        className="bg-background-0 rounded-2xl overflow-hidden border border-outline-100 shadow-soft-4 mx-4 mb-3"
        style={{ flexDirection: 'row', height: 100 }}
      >
        {/* Thumbnail */}
        <Box style={{ width: 100, height: '100%' }}>
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-white/60 font-inter-black text-2xl">
                {task.title.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
        </Box>

        {/* Content */}
        <VStack className="flex-1 p-3 justify-between">
          {/* Top Row: Title & Status */}
          <HStack className="justify-between items-start">
            <VStack className="flex-1 mr-2">
              <Text
                className="text-typography-900 font-inter-bold text-sm leading-tight"
                numberOfLines={2}
              >
                {task.title}
              </Text>
            </VStack>

            {/* Status Badge */}
            <Box
              className="px-2 py-1 rounded-full flex-row items-center"
              style={{ backgroundColor: status.bgColor }}
            >
              <StatusIcon size={12} color={status.color} />
              <Text
                className="text-xs font-inter-semibold ml-1"
                style={{ color: status.color }}
              >
                {status.label}
              </Text>
            </Box>
          </HStack>

          {/* Bottom Row: Meta Info */}
          <HStack className="items-center justify-between mt-auto">
            <HStack className="items-center gap-3">
              {/* Activity Type */}
              <HStack className="items-center">
                <ActivityIcon size={14} color={activityConfig.color} />
                <Text className="text-typography-500 text-xs ml-1">
                  {task.activity}
                </Text>
              </HStack>

              {/* Attached Files */}
              {submission.files.length > 0 && (
                <HStack className="items-center gap-1">
                  {imageCount > 0 && (
                    <HStack className="items-center">
                      <ImageIcon size={12} color={isDark ? '#a3a3a3' : '#737373'} />
                      <Text className="text-typography-400 text-xs ml-0.5">{imageCount}</Text>
                    </HStack>
                  )}
                  {videoCount > 0 && (
                    <HStack className="items-center">
                      <Video size={12} color={isDark ? '#a3a3a3' : '#737373'} />
                      <Text className="text-typography-400 text-xs ml-0.5">{videoCount}</Text>
                    </HStack>
                  )}
                  {docCount > 0 && (
                    <HStack className="items-center">
                      <File size={12} color={isDark ? '#a3a3a3' : '#737373'} />
                      <Text className="text-typography-400 text-xs ml-0.5">{docCount}</Text>
                    </HStack>
                  )}
                </HStack>
              )}
            </HStack>

            {/* Points & Date */}
            <HStack className="items-center gap-2">
              {submission.status === 'approved' && submission.pointsAwarded > 0 && (
                <Text className="text-success-600 font-inter-bold text-xs">
                  +{submission.pointsAwarded} SP
                </Text>
              )}
              {submission.status === 'pending' && task.scholarshipPoints > 0 && (
                <Text className="text-warning-600 font-inter-semibold text-xs">
                  {task.scholarshipPoints} SP
                </Text>
              )}
              <Text className="text-typography-400 text-xs">
                {formatDate(submission.createdAt)}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}

export default SubmissionCard;
