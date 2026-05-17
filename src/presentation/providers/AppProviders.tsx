import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@shopify/restyle';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '../../infrastructure/di/queryClient';
import theme, { darkTheme } from '../../infrastructure/theme/theme';
import { RootNavigator } from '../../infrastructure/navigation/RootNavigator';
import { ThemeModeProvider, useThemeMode } from '../theme/ThemeModeContext';

function Bridges({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeMode();
  return (
    <ThemeProvider theme={isDark ? darkTheme : theme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </ThemeProvider>
  );
}

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeModeProvider>
          <Bridges>
            <RootNavigator />
          </Bridges>
        </ThemeModeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
