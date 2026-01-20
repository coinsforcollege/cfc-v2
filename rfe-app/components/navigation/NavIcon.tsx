'use client';
import React from 'react';
import { Box } from '@/components/ui/box';
import { Home, ListTodo, GraduationCap, Gift, FileText, User } from './icons';

export type NavRoute = 'index' | 'tasks' | 'colleges' | 'offers' | 'documents' | 'profile';

interface NavIconProps {
  route: NavRoute;
  focused: boolean;
  size?: number;
}

const iconMap: Record<NavRoute, typeof Home> = {
  index: Home,
  tasks: ListTodo,
  colleges: GraduationCap,
  offers: Gift,
  documents: FileText,
  profile: User,
};

const labelMap: Record<NavRoute, string> = {
  index: 'Home',
  tasks: 'Tasks',
  colleges: 'Colleges',
  offers: 'Offers',
  documents: 'Documents',
  profile: 'Profile',
};

export function getNavLabel(route: NavRoute): string {
  return labelMap[route];
}

export function NavIcon({ route, focused, size = 22 }: NavIconProps) {
  const Icon = iconMap[route];

  return (
    <Box
      className={`
        items-center justify-center
        ${focused ? 'opacity-100' : 'opacity-60'}
      `}
    >
      <Icon
        size={size}
        strokeWidth={focused ? 2.25 : 1.75}
        color={focused ? 'rgb(var(--color-primary-700))' : 'rgb(var(--color-typography-600))'}
      />
    </Box>
  );
}

export { iconMap, labelMap };
