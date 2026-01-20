'use client';
import React from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const TABLET_BREAKPOINT = 768;

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { width } = useWindowDimensions();
  
  // On web, also check for actual viewport width
  const isDesktop = Platform.OS === 'web' 
    ? width >= TABLET_BREAKPOINT 
    : width >= TABLET_BREAKPOINT;

  if (isDesktop) {
    // Desktop layout: Sidebar + Content
    return (
      <HStack className="flex-1 bg-background-0 dark:bg-background-0">
        <Sidebar />
        <Box className="flex-1 bg-background-50 dark:bg-background-50">
          {children}
        </Box>
      </HStack>
    );
  }

  // Mobile layout: Content + Bottom Nav
  return (
    <Box className="flex-1 bg-primary-500 dark:bg-primary-500">
      <Box className="flex-1 bg-background-0 dark:bg-background-0">
        {children}
      </Box>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
        <BottomNav />
      </SafeAreaView>
    </Box>
  );
}

export function useIsDesktop(): boolean {
  const { width } = useWindowDimensions();
  return width >= TABLET_BREAKPOINT;
}
