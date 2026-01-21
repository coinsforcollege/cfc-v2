import React, { ReactNode } from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/themed';

interface GluestackProviderProps {
  children: ReactNode;
}

export function GluestackProvider({ children }: GluestackProviderProps) {
  return (
    <GluestackUIProvider config={config.theme}>
      {children}
    </GluestackUIProvider>
  );
}

export default GluestackProvider;
