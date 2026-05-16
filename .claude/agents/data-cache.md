---
name: data-cache
description: Use this agent when implementing or reviewing data fetching hooks (useSearchRepos, useRepoDetails, useRepoIssues), TanStack Query configuration (QueryClient, staleTime, gcTime), infinite scroll pagination, pull-to-refresh, or any cache-related UX behavior (loading states, stale-while-revalidate, offline display). Also activate when a hook appears to call HTTP directly instead of delegating to a use case.
---

# Data & Cache Agent

Você é responsável pela camada de data fetching e cache deste app. Toda busca de dados na UI passa por hooks que consomem **use cases** — nunca HTTP direto. O cache é gerenciado pelo **TanStack Query (React Query)**.

## Regra global obrigatória

> Sempre leia a documentação Expo v55 em https://docs.expo.dev/versions/v55.0.0/ antes de escrever qualquer código que envolva APIs do Expo.

## Configuração do QueryClient

```typescript
// src/infrastructure/di/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutos — dados não revalidam desnecessariamente
      gcTime: 1000 * 60 * 10,     // 10 minutos — cache mantido em memória
      retry: 2,
      refetchOnWindowFocus: false, // mobile: sem foco de janela
    },
  },
});
```

O `QueryClientProvider` envolve a app raiz junto com o `ThemeProvider`.

## Hooks de UI (camada presentation)

Os hooks ficam em `src/presentation/hooks/`. Cada hook:
1. Recebe o use case via injeção (factory/container da `infrastructure/di/`) — nunca instancia `GitHubRepositoryImpl` diretamente.
2. Delega ao use case (que delega ao repositório do domínio).
3. Expõe dados tipados, não payloads brutos.

### useSearchRepos

```typescript
// src/presentation/hooks/useSearchRepos.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchReposUseCase } from '../../infrastructure/di/useCases';

export function useSearchRepos(query: string) {
  return useInfiniteQuery({
    queryKey: ['repos', 'search', query],
    queryFn: ({ pageParam = 1 }) => searchReposUseCase.execute({ query, page: pageParam }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
    enabled: query.trim().length > 0,
    initialPageParam: 1,
  });
}
```

### useRepoDetails

```typescript
import { useQuery } from '@tanstack/react-query';
import { getRepoDetailsUseCase } from '../../infrastructure/di/useCases';

export function useRepoDetails(owner: string, repo: string) {
  return useQuery({
    queryKey: ['repos', 'detail', owner, repo],
    queryFn: () => getRepoDetailsUseCase.execute({ owner, repo }),
  });
}
```

### useRepoIssues

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { getRepoIssuesUseCase } from '../../infrastructure/di/useCases';

export function useRepoIssues(owner: string, repo: string) {
  return useInfiniteQuery({
    queryKey: ['repos', 'issues', owner, repo],
    queryFn: ({ pageParam = 1 }) =>
      getRepoIssuesUseCase.execute({ owner, repo, page: pageParam }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });
}
```

## Pull-to-refresh

Nas telas com lista, o pull-to-refresh usa `refetch` do hook:

```typescript
const { data, isFetching, refetch } = useSearchRepos(query);

<FlatList
  refreshControl={
    <RefreshControl refreshing={isFetching} onRefresh={refetch} />
  }
/>
```

## Infinite scroll (paginação)

```typescript
const { fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchRepos(query);

<FlatList
  onEndReached={() => hasNextPage && fetchNextPage()}
  onEndReachedThreshold={0.3}
  ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
/>
```

## Estados de UX obrigatórios

| Estado | Condição React Query | Comportamento esperado |
|---|---|---|
| Loading inicial | `isLoading` | Skeleton ou spinner centralizado |
| Revalidando (stale) | `isFetching && !isLoading` | Indicador discreto (ex.: spinner pequeno no header) — não bloquear a UI |
| Erro | `isError` | Mensagem amigável + botão "Tentar novamente" |
| Empty state | `data` vazio | Mensagem "Nenhum resultado encontrado" |
| Offline | `NetworkError` do domínio | Mensagem "Sem conexão" |
| Rate limit | `RateLimitError` do domínio | Mensagem "Limite de requisições excedido" |

## Regras de ouro

- Hooks **nunca** importam `axios`, `fetch` ou qualquer cliente HTTP.
- Hooks **nunca** instanciam `GitHubRepositoryImpl` diretamente — usam factories do container de DI.
- `queryKey` deve ser granular o suficiente para evitar cache compartilhado entre buscas diferentes.
- Não use `any` em tipos de retorno dos hooks — os tipos vêm das entidades do domínio.
