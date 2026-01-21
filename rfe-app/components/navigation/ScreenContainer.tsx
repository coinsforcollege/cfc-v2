'use client';
import React from 'react';
import { ScrollView, Pressable, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/src/contexts/AuthContext';
import { ChevronLeft } from './icons';

const TABLET_BREAKPOINT = 768;
// Default safe area values to prevent layout flash
const DEFAULT_TOP_INSET = Platform.OS === 'ios' ? 47 : 24;

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Small label above heading - Swiss style uppercase tracking */
  label?: string;
  /** Main heading */
  heading?: string;
  /** Whether to show header section */
  showHeader?: boolean;
  /** Whether to show back button (auto-hidden on home) */
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
        className="
          w-10 h-10 rounded-full 
          bg-primary-500 dark:bg-primary-500
          items-center justify-center
        "
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
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= TABLET_BREAKPOINT;
  
  // Check if we're on home page
  const isHome = pathname === '/' || pathname === '/(app)' || pathname === '';
  
  // Use insets with fallback to prevent layout flash on mobile
  const topPadding = isDesktop ? 0 : Math.max(insets.top, DEFAULT_TOP_INSET);
  const bottomPadding = isDesktop ? 0 : Math.max(insets.bottom, 0);

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-0">
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
            px-6 py-4
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
            {/* Page header with back button and avatar */}
            {showHeader && (
              <HStack className="items-center justify-between">
                <HStack className="items-center flex-1" space="sm">
                  {/* Back button - hidden on home and desktop */}
                  {showBackButton && !isHome && !isDesktop && (
                    <Pressable
                      onPress={() => router.back()}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                      className="mr-1"
                    >
                      <Box className="w-10 h-10 items-center justify-center">
                        <ChevronLeft size={24} strokeWidth={2} color="#1a1a1a" />
                      </Box>
                    </Pressable>
                  )}
                  
                  {/* Title area */}
                  <VStack space="xs" className="flex-1">
                    {label && (
                      <Text 
                        className="
                          text-[11px] font-medium tracking-[0.15em] uppercase 
                          text-typography-400 dark:text-typography-500
                        "
                      >
                        {label}
                      </Text>
                    )}
                    {heading && (
                      <Heading 
                        size="xl" 
                        className="
                          text-typography-950 dark:text-typography-950
                          tracking-tight font-semibold
                        "
                      >
                        {heading}
                      </Heading>
                    )}
                  </VStack>
                </HStack>
                
                {/* User avatar - only on mobile */}
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
