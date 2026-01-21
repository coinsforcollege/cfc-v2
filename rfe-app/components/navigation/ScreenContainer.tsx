'use client';
import React from 'react';
import { ScrollView, Pressable, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/src/contexts/AuthContext';
import { ChevronLeft } from './icons';

const TABLET_BREAKPOINT = 768;
const DEFAULT_TOP_INSET = Platform.OS === 'ios' ? 47 : 24;

interface ScreenContainerProps {
  children: React.ReactNode;
  label?: string;
  heading?: string;
  showHeader?: boolean;
  showBackButton?: boolean;
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Pressable
      onPress={() => router.push('/(app)/profile')}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Box 
        className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center"
      >
        <Text className="text-sm font-semibold text-typography-0">
          {initials || 'U'}
        </Text>
      </Box>
    </Pressable>
  );
}

export function ScreenContainer({ 
  children, 
  label, 
  heading,
  showHeader = true,
  showBackButton = true,
}: ScreenContainerProps) {
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= TABLET_BREAKPOINT;
  
  const topPadding = isDesktop ? 0 : Math.max(insets.top, DEFAULT_TOP_INSET);
  const bottomPadding = isDesktop ? 0 : Math.max(insets.bottom, 0);

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: topPadding,
          paddingBottom: bottomPadding,
        }}
      >
        <Box 
          className={`
            px-4 py-4
            ${isDesktop ? 'px-10 py-8' : ''}
          `}
        >
          <VStack 
            className={`
              w-full self-center items-stretch
              ${isDesktop ? 'max-w-[1000px]' : ''}
            `} 
            space="3xl"
            style={{ alignItems: 'stretch' }}
          >
            {showHeader && (
              <HStack className="items-center justify-between">
                <HStack className="items-center flex-1" space="sm">
                  {showBackButton && !isDesktop && (
                    <Pressable
                      onPress={() => router.back()}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                      className="mr-1"
                    >
                      <Box className="w-10 h-10 items-center justify-center">
                        <ChevronLeft size={24} strokeWidth={2} className="text-typography-950" />
                      </Box>
                    </Pressable>
                  )}
                  
                  <VStack space="xs" className="flex-1">
                    {label && (
                      <Text 
                        className="text-sm font-medium tracking-[0.15em] uppercase text-typography-400"
                      >
                        {label}
                      </Text>
                    )}
                    {heading && (
                      <Heading 
                        size="xl" 
                        className="text-typography-950 tracking-tight font-semibold"
                      >
                        {heading}
                      </Heading>
                    )}
                  </VStack>
                </HStack>
                
                {!isDesktop && (
                  <UserAvatar name={user?.name || 'User'} />
                )}
              </HStack>
            )}
            
            {children}
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
