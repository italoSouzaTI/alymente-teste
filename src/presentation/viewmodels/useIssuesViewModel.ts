import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Issue } from '../../domain/entities/Issue';
import { RateLimitError, NetworkError } from '../../domain/errors/GitHubErrors';
import { getRepoIssuesUseCase } from '../../infrastructure/di/container';

// ─── State ──────────────────────────────────────────────────────────────────

export interface IssuesViewState {
  issues: Issue[];
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasNextPage: boolean;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export interface IssuesViewActions {
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

export function useIssuesViewModel(
  owner: string,
  repo: string,
): [IssuesViewState, IssuesViewActions] {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['repos', 'issues', owner, repo],
    queryFn: ({ pageParam }) =>
      getRepoIssuesUseCase.execute({ owner, repo, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: Boolean(owner && repo),
  });

  const issues = data?.pages.flatMap((p) => p.items) ?? [];

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  const state: IssuesViewState = {
    issues,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    isRefreshing: isFetching && !isLoading && !isFetchingNextPage,
    error: error ? parseError(error) : null,
    hasNextPage: hasNextPage ?? false,
  };

  return [state, { loadMore, refresh, retry }];
}
