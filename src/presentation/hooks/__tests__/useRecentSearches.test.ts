import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRecentSearches } from '../useRecentSearches';

function makeWrapper(queryClient: QueryClient) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

function makeInfiniteData(totalCount: number) {
  return {
    pages: [{ items: [], totalCount, hasNextPage: false }],
    pageParams: [1],
  };
}

describe('useRecentSearches', () => {
  it('retorna lista vazia quando não há buscas cacheadas', () => {
    const qc = new QueryClient();
    const { result } = renderHook(() => useRecentSearches(), { wrapper: makeWrapper(qc) });
    expect(result.current).toHaveLength(0);
  });

  it('retorna buscas existentes no cache com totalCount correto', () => {
    const qc = new QueryClient();
    qc.setQueryData(['repos', 'search', 'vue'], makeInfiniteData(500));
    qc.setQueryData(['repos', 'search', 'react'], makeInfiniteData(1000));

    const { result } = renderHook(() => useRecentSearches(), { wrapper: makeWrapper(qc) });

    expect(result.current).toHaveLength(2);
    const queries = result.current.map((s) => s.query);
    expect(queries).toContain('react');
    expect(queries).toContain('vue');
    const reactItem = result.current.find((s) => s.query === 'react');
    expect(reactItem?.totalCount).toBe(1000);
  });

  it('atualiza a lista quando uma nova query é adicionada ao cache', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-01T10:00:00Z'));

    const qc = new QueryClient();
    qc.setQueryData(['repos', 'search', 'react'], makeInfiniteData(1000));

    const { result } = renderHook(() => useRecentSearches(), { wrapper: makeWrapper(qc) });
    expect(result.current).toHaveLength(1);

    await act(async () => {
      jest.setSystemTime(new Date('2024-06-01T11:00:00Z'));
      qc.setQueryData(['repos', 'search', 'svelte'], makeInfiniteData(200));
    });

    await waitFor(() => {
      expect(result.current).toHaveLength(2);
      expect(result.current[0].query).toBe('svelte');
    });

    jest.useRealTimers();
  });

  it('limita o resultado a 8 itens', () => {
    const qc = new QueryClient();
    for (let i = 0; i < 12; i++) {
      qc.setQueryData(['repos', 'search', `query${i}`], makeInfiniteData(i * 10));
    }

    const { result } = renderHook(() => useRecentSearches(), { wrapper: makeWrapper(qc) });
    expect(result.current).toHaveLength(8);
  });

  it('ignora queries com key diferente de repos/search', () => {
    const qc = new QueryClient();
    qc.setQueryData(['repos', 'detail', 'owner/repo'], { id: 1 });
    qc.setQueryData(['repos', 'search', 'react'], makeInfiniteData(100));

    const { result } = renderHook(() => useRecentSearches(), { wrapper: makeWrapper(qc) });
    expect(result.current).toHaveLength(1);
    expect(result.current[0].query).toBe('react');
  });
});
