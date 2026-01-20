import { Platform } from 'react-native';

// API URL configuration
const getApiUrl = (): string => {
  if (__DEV__) {
    // Development: Android emulator uses 10.0.2.2, others use localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:4000/api';
    }
    return 'http://localhost:4000/api';
  }
  // Production
  return 'https://cfc-v2-server.onrender.com/api';
};

// reCAPTCHA site key (web only)
const getRecaptchaSiteKey = (): string => {
  if (__DEV__) {
    // Google's test key for development
    return '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  }
  // Production key should be set via environment
  return process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY || '';
};

export const config = {
  apiUrl: getApiUrl(),
  recaptchaSiteKey: getRecaptchaSiteKey(),
  platform: Platform.OS as 'ios' | 'android' | 'web',
  isWeb: Platform.OS === 'web',
  isNative: Platform.OS !== 'web',
  mainWebsiteUrl: 'https://coinsforcollege.org',
};

export default config;
