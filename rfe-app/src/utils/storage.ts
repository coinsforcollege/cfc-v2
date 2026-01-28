import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@rfe_auth_token',
  USER_DATA: '@rfe_user_data',
  SCHOLARSHIP_TIER: '@rfe_scholarship_tier',
  HAS_SEEN_ONBOARDING: '@rfe_has_seen_onboarding',
};

export const storage = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async getUserData<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setUserData<T>(data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.AUTH_TOKEN, KEYS.USER_DATA]);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  },

  async getScholarshipTier(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.SCHOLARSHIP_TIER);
    } catch {
      return null;
    }
  },

  async setScholarshipTier(tier: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SCHOLARSHIP_TIER, tier);
    } catch (error) {
      console.error('Error saving scholarship tier:', error);
    }
  },

  async hasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.HAS_SEEN_ONBOARDING);
      return value === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HAS_SEEN_ONBOARDING, 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },
};

export default storage;
