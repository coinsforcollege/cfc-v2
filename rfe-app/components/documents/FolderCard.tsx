'use client';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Folder } from '@/src/api/documents.api';

interface FolderCardProps {
  folder: Folder;
  onPress: (folder: Folder) => void;
  onLongPress?: (folder: Folder) => void;
  isSelected?: boolean;
}

// Folder icon component
function FolderIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size * 0.8, position: 'relative' }}>
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size * 0.45,
          height: size * 0.22,
          backgroundColor: color,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: size * 0.18,
          left: 0,
          width: size,
          height: size * 0.62,
          backgroundColor: color,
          borderRadius: 4,
        }}
      />
    </Box>
  );
}

export function FolderCard({ folder, onPress, onLongPress, isSelected }: FolderCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={() => onPress(folder)}
      onLongPress={() => onLongPress?.(folder)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        flex: 1,
      })}
    >
      <Box
        className={`rounded-2xl overflow-hidden ${
          isSelected ? 'border-2 border-primary-500' : ''
        }`}
        style={{
          height: 130,
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        }}
      >
        {/* Icon Area */}
        <Box
          className="flex-1 items-center justify-center"
          style={{ paddingTop: 16 }}
        >
          <Box
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.12)',
            }}
          >
            <FolderIcon size={28} color={isDark ? '#60a5fa' : '#3b82f6'} />
          </Box>
        </Box>

        {/* Info Area */}
        <Box className="px-3 pb-3">
          <Text
            className="text-sm font-inter-semibold text-typography-900 text-center"
            numberOfLines={1}
          >
            {folder.name}
          </Text>
          <Text className="text-xs text-typography-500 text-center mt-0.5">
            Folder
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}

export default FolderCard;
