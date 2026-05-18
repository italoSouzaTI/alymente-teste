import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Repo } from '@domain/entities/Repo';
import { RateLimitError, NetworkError } from '@domain/errors/GitHubErrors';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useUseCases } from '@presentation/providers/UseCasesContext';
import { STALE_TIME_MS } from '@infrastructure/di/cacheConfig';

// ─── State ──────────────────────────────────────────────────────────────────

export interface SearchViewState {
  query: string;
  repos: Repo[];
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasNextPage: boolean;
  totalCount: number;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export interface SearchViewActions {
  setQuery: (query: string) => void;
  loadMore: () => void;
  refresh: () => void;
  retry: () => void;
}

// ─── ViewModel ───────────────────────────────────────────────────────────────

function parseError(error: unknown): string {
  if (error instanceof RateLimitError || error instanceof NetworkError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Erro desconhecido. Tente novamente.';
}

export function useSearchViewModel(): [SearchViewState, SearchViewActions] {
  const [query, setQueryState] = useState('');
  const isOnline = useOnlineStatus();
  const { searchReposUseCase } = useUseCases();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isFetching,
    fetchStatus,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['repos', 'search', query],
    queryFn: ({ pageParam }) => searchReposUseCase.execute({ query, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: query.trim().length > 0,
    staleTime: STALE_TIME_MS,
  });

  const repos = data?.pages.flatMap((p) => p.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasQuery = query.trim().length > 0;
  const offlineNoCache = !isOnline && repos.length === 0 && hasQuery && !error;

  const state: SearchViewState = {
    query,
    repos,
    isLoading: isLoading && fetchStatus !== 'paused' && hasQuery,
    isFetchingMore: isFetchingNextPage,
    isRefreshing: isFetching && !isLoading && !isFetchingNextPage,
    error: offlineNoCache ? new NetworkError().message : error ? parseError(error) : null,
    hasNextPage: hasNextPage ?? false,
    totalCount,
  };

  const actions: SearchViewActions = { setQuery, loadMore, refresh, retry };

  return [state, actions];
}
