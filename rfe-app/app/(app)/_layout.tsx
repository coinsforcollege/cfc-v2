import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  if (!isAuthenticated) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
