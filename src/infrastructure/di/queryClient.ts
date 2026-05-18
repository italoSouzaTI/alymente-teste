import { QueryClient } from '@tanstack/react-query';
import { NetworkError } from '@domain/errors/GitHubErrors';
import { STALE_TIME_MS, CACHE_MAX_AGE_MS } from './cacheConfig';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      gcTime: CACHE_MAX_AGE_MS,
      retry: (failureCount, error) => !(error instanceof NetworkError) && failureCount < 2,
      refetchOnWindowFocus: false,
    },
  },
});
