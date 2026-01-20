'use client';
import React from 'react';
import { ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

const TABLET_BREAKPOINT = 768;

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Small label above heading - Swiss style uppercase tracking */
  label?: string;
  /** Main heading */
  heading?: string;
  /** Whether to show header section */
  showHeader?: boolean;
}

export function ScreenContainer({ 
  children, 
  label, 
  heading,
  showHeader = true,
}: ScreenContainerProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= TABLET_BREAKPOINT;

  // On desktop, we don't need SafeAreaView for top since sidebar provides structure
  // On mobile, we need it to avoid notch/status bar
  const Container = isDesktop ? Box : SafeAreaView;
  const containerProps = isDesktop 
    ? { className: 'flex-1' } 
    : { style: { flex: 1 }, edges: ['top'] as const };

  return (
    <Container {...containerProps}>
      <ScrollView 
        className="flex-1 bg-background-0 dark:bg-background-0"
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Box 
          className={`
            px-6 py-6
            ${isDesktop ? 'px-10 py-8' : ''}
          `}
        >
          <VStack 
            className={`
              w-full self-center
              ${isDesktop ? 'max-w-[1000px]' : 'max-w-[600px]'}
            `} 
            space="xl"
          >
            {/* Page header - Swiss minimal typography */}
            {showHeader && (label || heading) && (
              <VStack space="xs" className="mb-2">
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
                    size="2xl" 
                    className="
                      text-typography-950 dark:text-typography-950
                      tracking-tight font-semibold
                    "
                  >
                    {heading}
                  </Heading>
                )}
              </VStack>
            )}
            
            {children}
          </VStack>
        </Box>
      </ScrollView>
    </Container>
  );
}
