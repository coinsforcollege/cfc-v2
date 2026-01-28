import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { storage } from '@/src/utils/storage';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await storage.hasSeenOnboarding();
      setHasSeenOnboarding(seen);
    };
    checkOnboarding();
  }, []);

  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-gray-500 mt-4">Loading...</Text>
      </View>
    );
  }

  // Show onboarding for first-time users (not authenticated yet)
  if (!hasSeenOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
