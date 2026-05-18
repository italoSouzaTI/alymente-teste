import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface RecentSearch {
  query: string;
  totalCount: number;
  updatedAt: number;
}

const MAX_ITEMS = 8;

function deriveRecentSearches(queryClient: ReturnType<typeof useQueryClient>): RecentSearch[] {
  const results: RecentSearch[] = [];

  for (const query of queryClient.getQueryCache().getAll()) {
    const key = query.queryKey;
    if (
      key[0] === 'repos' &&
      key[1] === 'search' &&
      typeof key[2] === 'string' &&
      key[2].trim().length > 0 &&
      query.state.data != null
    ) {
      const data = query.state.data as { pages: { totalCount: number }[] };
      results.push({
        query: key[2] as string,
        totalCount: data.pages[0]?.totalCount ?? 0,
        updatedAt: query.state.dataUpdatedAt,
      });
    }
  }

  return results.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_ITEMS);
}

export function useRecentSearches(): RecentSearch[] {
  const queryClient = useQueryClient();
  const [searches, setSearches] = useState<RecentSearch[]>(() => deriveRecentSearches(queryClient));

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      // Evita setState durante o render de outra tela (ex.: RepoDetail atualizando o cache).
      queueMicrotask(() => {
        setSearches(deriveRecentSearches(queryClient));
      });
    });
    return unsubscribe;
  }, [queryClient]);

  return searches;
}
