import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Repo } from '@domain/entities/Repo';
import { RateLimitError, NetworkError } from '@domain/errors/GitHubErrors';
import { getRepoDetailsUseCase } from '@infrastructure/di/container';

// ─── State ──────────────────────────────────────────────────────────────────

export interface RepoDetailViewState {
  repo: Repo | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export interface RepoDetailViewActions {
  retry: () => void;
}

// ─── ViewModel ───────────────────────────────────────────────────────────────

function parseError(error: unknown): string {
  if (error instanceof RateLimitError || error instanceof NetworkError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Erro desconhecido. Tente novamente.';
}

export function useRepoDetailViewModel(
  owner: string,
  repo: string,
): [RepoDetailViewState, RepoDetailViewActions] {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['repos', 'detail', owner, repo],
    queryFn: () => getRepoDetailsUseCase.execute({ owner, repo }),
    enabled: Boolean(owner && repo),
  });

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  const state: RepoDetailViewState = {
    repo: data ?? null,
    isLoading,
    error: error ? parseError(error) : null,
  };

  return [state, { retry }];
}
