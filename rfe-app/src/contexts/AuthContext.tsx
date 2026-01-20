import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { storage } from '@/src/utils/storage';
import { authApi, User } from '@/src/api/auth';
import config from '@/src/config';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, recaptchaToken?: string) => Promise<{ success: boolean; message: string; isNonStudent?: boolean }>;
  logout: () => Promise<void>;
  setAuthData: (user: User, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await storage.getToken();
        const userData = await storage.getUserData<User>();

        if (token && userData) {
          // Verify token is still valid
          try {
            const response = await authApi.getMe(token);
            if (response.success && response.data) {
              if (response.data.role !== 'student') {
                await storage.clearAuth();
                setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
                return;
              }
              setState({ user: response.data, token, isLoading: false, isAuthenticated: true });
              await storage.setUserData(response.data);
              return;
            }
          } catch {
            await storage.clearAuth();
          }
        }
        setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
      } catch {
        setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, recaptchaToken?: string) => {
    try {
      const response = await authApi.login(email, password, recaptchaToken);

      if (response.success && response.data && response.token) {
        if (response.data.role !== 'student') {
          return {
            success: false,
            message: `This app is only for students. Please visit ${config.mainWebsiteUrl} for other account types.`,
            isNonStudent: true,
          };
        }

        await storage.setToken(response.token);
        await storage.setUserData(response.data);
        setState({ user: response.data, token: response.token, isLoading: false, isAuthenticated: true });
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (state.token) {
        await authApi.logout(state.token);
      }
    } catch {
      // Ignore logout API errors
    } finally {
      await storage.clearAuth();
      setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
    }
  }, [state.token]);

  const setAuthData = useCallback(async (user: User, token: string) => {
    await storage.setToken(token);
    await storage.setUserData(user);
    setState({ user, token, isLoading: false, isAuthenticated: true });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
