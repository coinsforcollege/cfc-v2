import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Rewards For Education',
  slug: 'rfe-app',
  version: '3.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'rfe',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-small.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.CoinsForCollege',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.coins.education',
    googleServicesFile: './google-services.json',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: './assets/adaptive-icon.png',
        color: '#6366f1',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '3c23c42a-731f-44f5-afa6-a1f681406918',
    },
    // Environment-specific configuration
    // These can be set via EAS Build secrets or .env files
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://cfc-v2-server.onrender.com/api',
    recaptchaSiteKey: process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY || '',
  },
});
