import { useEffect } from 'react';
import { Slot, router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { DashboardLayout } from '@/components/navigation';

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

  return (
    <DashboardLayout>
      <Slot />
    </DashboardLayout>
  );
}
