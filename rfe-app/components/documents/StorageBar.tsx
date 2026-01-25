'use client';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';

interface StorageBarProps {
  used: number; // in bytes
  limit: number; // in bytes
}

// Format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function StorageBar({ used, limit }: StorageBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const percentage = Math.min((used / limit) * 100, 100);

  // Color based on usage
  let barColor = isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)'; // blue
  if (percentage > 80) {
    barColor = isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)'; // red
  } else if (percentage > 60) {
    barColor = isDark ? 'rgb(251, 191, 36)' : 'rgb(245, 158, 11)'; // yellow
  }

  return (
    <Box className="px-4 py-3 bg-background-50 border-b border-outline-100">
      <HStack className="items-center justify-between mb-2">
        <Text className="text-xs font-inter-medium text-typography-700">
          Storage
        </Text>
        <Text className="text-xs font-inter-semibold text-typography-900">
          {formatBytes(used)} / {formatBytes(limit)}
        </Text>
      </HStack>

      {/* Progress bar */}
      <Box
        className="h-2 rounded-full overflow-hidden"
        style={{
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </Box>

      {percentage > 80 && (
        <Text className="text-2xs text-error-500 mt-1">
          Storage almost full
        </Text>
      )}
    </Box>
  );
}

export default StorageBar;
