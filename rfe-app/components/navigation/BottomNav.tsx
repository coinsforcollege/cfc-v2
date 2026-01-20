'use client';
import React from 'react';
import { Pressable, Platform } from 'react-native';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { getNavLabel, type NavRoute } from './NavIcon';
import { Home, ListTodo, GraduationCap, Gift, FileText, User } from './icons';

const routes: { name: NavRoute; href: string }[] = [
  { name: 'index', href: '/(app)' },
  { name: 'tasks', href: '/(app)/tasks' },
  { name: 'colleges', href: '/(app)/colleges' },
  { name: 'offers', href: '/(app)/offers' },
  { name: 'documents', href: '/(app)/documents' },
  { name: 'profile', href: '/(app)/profile' },
];

const iconComponents = {
  index: Home,
  tasks: ListTodo,
  colleges: GraduationCap,
  offers: Gift,
  documents: FileText,
  profile: User,
};

interface BottomNavItemProps {
  route: NavRoute;
  href: string;
  isActive: boolean;
}

function BottomNavItem({ route, href, isActive, bottomPadding }: BottomNavItemProps & { bottomPadding: number }) {
  const Icon = iconComponents[route];
  const label = getNavLabel(route);

  return (
    <Box className="flex-1">
      <Pressable
        onPress={() => router.push(href as any)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <VStack 
          className={`
            items-center justify-center pt-3 gap-1.5
            ${isActive 
              ? 'bg-primary-950 dark:bg-primary-950' 
              : 'bg-transparent'
            }
          `}
          style={{ paddingBottom: bottomPadding + 12 }}
        >
          <Box className="text-typography-0">
            <Icon
              size={22}
              strokeWidth={2}
              color="currentColor"
            />
          </Box>
          
          <Text
            className={`
              text-2xs tracking-wide uppercase font-semibold
              ${isActive 
                ? 'text-typography-0 dark:text-typography-0' 
                : 'text-typography-0/70 dark:text-typography-0/70'
              }
            `}
          >
            {label}
          </Text>
        </VStack>
      </Pressable>
    </Box>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isRouteActive = (route: NavRoute): boolean => {
    if (route === 'index') {
      return pathname === '/' || pathname === '/(app)' || pathname === '';
    }
    return pathname.includes(route);
  };

  // Calculate bottom padding for safe area
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8;

  return (
    <Box className="bg-primary-500 dark:bg-primary-500 w-full">
      <HStack className="w-full">
        {routes.map((route) => (
          <BottomNavItem
            key={route.name}
            route={route.name}
            href={route.href}
            isActive={isRouteActive(route.name)}
            bottomPadding={bottomPadding}
          />
        ))}
      </HStack>
    </Box>
  );
}
