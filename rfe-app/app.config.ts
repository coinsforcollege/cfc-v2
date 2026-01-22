import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Rewards For Education',
  slug: 'rfe-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'rfe',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0a0f2e',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.rewardsforeducation.app',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0f2e',
    },
    package: 'com.rewardsforeducation.app',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
    // Environment-specific configuration
    // These can be set via EAS Build secrets or .env files
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://cfc-v2-server.onrender.com/api',
    recaptchaSiteKey: process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY || '',
  },
});
