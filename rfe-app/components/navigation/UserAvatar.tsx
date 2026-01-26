import React from 'react';
import { Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import config from '@/src/config';

interface UserAvatarProps {
  name: string;
  profilePicture?: string | null;
  size?: number;
}

export function UserAvatar({ name, profilePicture, size = 40 }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    const baseUrl = config.apiUrl.replace('/api', '');
    return `${baseUrl}${profilePicture}`;
  };

  const imageUrl = getProfilePictureUrl();

  return (
    <Pressable
      onPress={() => router.push('/(app)/profile')}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Box 
        className="rounded-full items-center justify-center overflow-hidden"
        style={{ 
          width: size, 
          height: size,
          backgroundColor: imageUrl ? 'transparent' : '#6366f1'
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
            resizeMode="cover"
          />
        ) : (
          <Text 
            className="font-inter-bold text-typography-0"
            style={{ fontSize: size * 0.35 }}
          >
            {initials || 'U'}
          </Text>
        )}
      </Box>
    </Pressable>
  );
}
