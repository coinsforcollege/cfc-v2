import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import config from '@/src/config';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (key: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isRequired = Platform.OS === 'web';

  useEffect(() => {
    // In development, we use mock-token, so no need to load script
    if (__DEV__) {
      setIsLoaded(true);
      return;
    }

    if (Platform.OS !== 'web') return;

    if (typeof window !== 'undefined' && window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${config.recaptchaSiteKey}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha.ready(() => setIsLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    // In development, return mock-token (backend accepts this)
    if (__DEV__) {
      return 'mock-token';
    }

    if (Platform.OS !== 'web') return null;
    if (!isLoaded || !window.grecaptcha) return null;

    try {
      return await window.grecaptcha.execute(config.recaptchaSiteKey, { action });
    } catch {
      return null;
    }
  }, [isLoaded]);

  return { executeRecaptcha, isLoaded, isRequired };
}
