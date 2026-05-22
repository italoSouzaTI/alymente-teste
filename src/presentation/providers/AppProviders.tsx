import React, { useEffect } from 'react';
import { View } from 'react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from '@shopify/restyle';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@infrastructure/di/queryClient';
import { queryPersister } from '@infrastructure/di/persister';
import { CACHE_MAX_AGE_MS } from '@infrastructure/di/cacheConfig';
import { setupOnlineManager } from '@infrastructure/network/onlineManagerBridge';
import {
  searchReposUseCase,
  getRepoDetailsUseCase,
  getRepoIssuesUseCase,
} from '@infrastructure/di/container';
import theme, { darkTheme } from '@infrastructure/theme/theme';
import { RootNavigator } from '@presentation/navigation/RootNavigator';
import { ThemeModeProvider, useThemeMode } from '@theme/ThemeModeContext';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { OfflineBanner } from '@components/common/OfflineBanner';
import { UseCasesProvider } from './UseCasesContext';

const useCases = { searchReposUseCase, getRepoDetailsUseCase, getRepoIssuesUseCase };

function Bridges({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeMode();
  return (
    <ThemeProvider theme={isDark ? darkTheme : theme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        <OfflineBanner />
        {children}
      </View>
    </ThemeProvider>
  );
}

export function AppProviders() {
  useEffect(() => setupOnlineManager(), []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: CACHE_MAX_AGE_MS,
        dehydrateOptions: {
          shouldDehydrateQuery: ({ queryKey }) =>
            Array.isArray(queryKey) && queryKey[1] !== 'issues',
        },
      }}
    >
      <SafeAreaProvider>
        <ThemeModeProvider>
          <UseCasesProvider value={useCases}>
            <Bridges>
              <ErrorBoundary>
                <RootNavigator />
              </ErrorBoundary>
            </Bridges>
          </UseCasesProvider>
        </ThemeModeProvider>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
