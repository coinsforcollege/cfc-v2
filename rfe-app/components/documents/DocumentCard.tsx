'use client';
import React, { useState } from 'react';
import { Pressable, Image as RNImage, useColorScheme } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { File, Image, Video } from '@/components/navigation/icons';
import { Document } from '@/src/api/documents.api';
import config from '@/src/config';

// File type icons and colors
const FILE_TYPE_CONFIG: Record<string, {
  icon: React.ComponentType<any>;
  color: string;
  bgLight: string;
  bgDark: string;
}> = {
  image: {
    icon: Image,
    color: '#10b981',
    bgLight: 'rgba(16, 185, 129, 0.1)',
    bgDark: 'rgba(16, 185, 129, 0.2)',
  },
  document: {
    icon: File,
    color: '#f59e0b',
    bgLight: 'rgba(245, 158, 11, 0.1)',
    bgDark: 'rgba(245, 158, 11, 0.2)',
  },
  video: {
    icon: Video,
    color: '#ef4444',
    bgLight: 'rgba(239, 68, 68, 0.1)',
    bgDark: 'rgba(239, 68, 68, 0.2)',
  },
};

interface DocumentCardProps {
  document: Document;
  onPress: (document: Document) => void;
  onLongPress?: (document: Document) => void;
  isSelected?: boolean;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Incognito/Private icon
function IncognitoIcon({ size }: { size: number }) {
  return (
    <Box style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Hat */}
      <Box
        style={{
          position: 'absolute',
          top: size * 0.1,
          width: size * 0.8,
          height: size * 0.25,
          backgroundColor: '#6b7280',
          borderTopLeftRadius: size * 0.15,
          borderTopRightRadius: size * 0.15,
        }}
      />
      {/* Brim */}
      <Box
        style={{
          position: 'absolute',
          top: size * 0.32,
          width: size * 0.95,
          height: size * 0.12,
          backgroundColor: '#6b7280',
          borderRadius: size * 0.06,
        }}
      />
      {/* Glasses */}
      <Box
        style={{
          position: 'absolute',
          top: size * 0.5,
          width: size * 0.85,
          height: size * 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left lens */}
        <Box
          style={{
            width: size * 0.35,
            height: size * 0.28,
            backgroundColor: '#374151',
            borderRadius: size * 0.14,
            borderWidth: 2,
            borderColor: '#6b7280',
          }}
        />
        {/* Bridge */}
        <Box
          style={{
            width: size * 0.1,
            height: 2,
            backgroundColor: '#6b7280',
          }}
        />
        {/* Right lens */}
        <Box
          style={{
            width: size * 0.35,
            height: size * 0.28,
            backgroundColor: '#374151',
            borderRadius: size * 0.14,
            borderWidth: 2,
            borderColor: '#6b7280',
          }}
        />
      </Box>
    </Box>
  );
}

export function DocumentCard({ document, onPress, onLongPress, isSelected }: DocumentCardProps) {
  const [imageError, setImageError] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fileConfig = FILE_TYPE_CONFIG[document.fileType] || FILE_TYPE_CONFIG.document;
  const FileIcon = fileConfig.icon;

  // Build thumbnail URL for images
  const imageUrl = document.fileType === 'image' && document.url
    ? document.url.startsWith('http')
      ? document.url
      : `${config.apiUrl.replace('/api', '')}${document.url}`
    : null;

  const showThumbnail = document.fileType === 'image' && imageUrl && !imageError;

  return (
    <Pressable
      onPress={() => onPress(document)}
      onLongPress={() => onLongPress?.(document)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        flex: 1,
      })}
    >
      <Box
        className={`rounded-2xl overflow-hidden ${
          isSelected ? 'border-2 border-primary-500' : 'border border-outline-100'
        }`}
        style={{
          height: 130,
          backgroundColor: isDark ? '#18181b' : '#ffffff',
        }}
      >
        {/* Thumbnail or Icon Area */}
        <Box
          className="flex-1 items-center justify-center relative"
          style={{
            backgroundColor: showThumbnail
              ? undefined
              : (isDark ? fileConfig.bgDark : fileConfig.bgLight),
          }}
        >
          {showThumbnail ? (
            <RNImage
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Box
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <FileIcon size={24} color={fileConfig.color} />
            </Box>
          )}

          {/* Private/Incognito Badge */}
          {!document.isPublic && (
            <Box
              className="absolute top-2 right-2 px-2 py-1 rounded-lg flex-row items-center"
              style={{
                backgroundColor: isDark ? 'rgba(75, 85, 99, 0.9)' : 'rgba(75, 85, 99, 0.85)',
              }}
            >
              <IncognitoIcon size={14} />
              <Text
                className="text-white text-2xs font-inter-semibold ml-1"
                style={{ letterSpacing: 0.3 }}
              >
                Private
              </Text>
            </Box>
          )}
        </Box>

        {/* Info Area */}
        <Box
          className="px-3 py-2"
          style={{
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          }}
        >
          <Text
            className="text-sm font-inter-medium text-typography-900"
            numberOfLines={1}
          >
            {document.name}
          </Text>
          <HStack className="items-center mt-0.5">
            <Text className="text-xs text-typography-500">
              {formatFileSize(document.size)}
            </Text>
            <Box
              className="w-1 h-1 rounded-full mx-1.5"
              style={{ backgroundColor: isDark ? '#52525b' : '#d4d4d8' }}
            />
            <Text className="text-xs text-typography-500 capitalize">
              {document.fileType}
            </Text>
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );
}

export default DocumentCard;
