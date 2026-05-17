import React from 'react';
import {
  render,
  renderHook,
  type RenderOptions,
  type RenderHookOptions,
} from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeModeProvider } from '@theme/ThemeModeContext';

interface ProviderOptions {
  withNavigation?: boolean;
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function buildWrapper(options?: ProviderOptions) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const queryClient = createQueryClient();
    const inner = (
      <QueryClientProvider client={queryClient}>
        <ThemeModeProvider>{children}</ThemeModeProvider>
      </QueryClientProvider>
    );
    if (options?.withNavigation) {
      return <NavigationContainer>{inner}</NavigationContainer>;
    }
    return inner;
  };
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & ProviderOptions,
) {
  const { withNavigation, ...renderOptions } = options ?? {};
  const Wrapper = buildWrapper({ withNavigation });
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  options?: RenderHookOptions<Props> & ProviderOptions,
) {
  const { withNavigation, ...hookOptions } = options ?? {};
  const Wrapper = buildWrapper({ withNavigation });
  return renderHook(hook, { wrapper: Wrapper, ...hookOptions });
}
