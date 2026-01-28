import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Thin': require('@/assets/fonts/Inter-Thin.otf'),
    'Inter-ExtraLight': require('@/assets/fonts/Inter-ExtraLight.otf'),
    'Inter-Light': require('@/assets/fonts/Inter-Light.otf'),
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.otf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.otf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.otf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.otf'),
    'Inter-ExtraBold': require('@/assets/fonts/Inter-ExtraBold.otf'),
    'Inter-Black': require('@/assets/fonts/Inter-Black.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#00000000');
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <GluestackUIProvider mode="system">
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </AuthProvider>
          </GluestackUIProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
