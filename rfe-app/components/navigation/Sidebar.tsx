'use client';
import React from 'react';
import { Pressable } from 'react-native';
import { usePathname, router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
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

interface SidebarItemProps {
  route: NavRoute;
  href: string;
  isActive: boolean;
}

function SidebarItem({ route, href, isActive }: SidebarItemProps) {
  const Icon = iconComponents[route];
  const label = getNavLabel(route);

  return (
    <Pressable
      onPress={() => router.push(href as any)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <HStack
        className={`
          relative px-6 py-3 items-center gap-4
          ${isActive 
            ? 'bg-primary-500' 
            : 'bg-transparent'
          }
        `}
      >
        {isActive && (
          <Box className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-800 dark:bg-primary-200" />
        )}
        
        <Box className={isActive ? 'text-typography-0' : 'text-typography-400'}>
          <Icon
            size={20}
            strokeWidth={isActive ? 2 : 1.5}
            color="currentColor"
          />
        </Box>
        
        <Text
          className={`
            text-sm tracking-tight
            ${isActive 
              ? 'font-semibold text-typography-0 dark:text-typography-0' 
              : 'font-normal text-typography-600 dark:text-typography-400'
            }
          `}
        >
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isRouteActive = (route: NavRoute): boolean => {
    if (route === 'index') {
      return pathname === '/' || pathname === '/(app)' || pathname === '';
    }
    return pathname.includes(route);
  };

  return (
    <Box 
      className="
        w-[280px] h-full
        bg-background-50
        border-r border-outline-100 dark:border-outline-200
      "
    >
      <VStack className="h-full">
        {/* Logo / Brand area */}
        <Box className="px-6 py-8 border-b border-outline-100 dark:border-outline-200">
          <Text className="text-xs font-medium tracking-widest uppercase text-typography-500">
            Student Portal
          </Text>
        </Box>

        {/* Navigation items */}
        <VStack className="flex-1 py-6">
          {/* Main items */}
          <VStack>
            {routes.slice(0, 4).map((route) => (
              <SidebarItem
                key={route.name}
                route={route.name}
                href={route.href}
                isActive={isRouteActive(route.name)}
              />
            ))}
          </VStack>

          {/* Visual separator */}
          <Box className="mx-6 my-4 h-[1px] bg-outline-100 dark:bg-outline-200" />

          {/* Account items */}
          <VStack>
            {routes.slice(4).map((route) => (
              <SidebarItem
                key={route.name}
                route={route.name}
                href={route.href}
                isActive={isRouteActive(route.name)}
              />
            ))}
          </VStack>
        </VStack>

        {/* Footer - minimal version indicator */}
        <Box className="px-6 py-4 border-t border-outline-100 dark:border-outline-200">
          <Text className="text-xs font-normal tracking-wide text-typography-400">
            v1.0.0
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
