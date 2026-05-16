---
name: screens-ux
description: Use this agent when building or reviewing screens (SearchScreen, RepoDetailScreen, IssuesScreen, ShowcaseScreen) and their UX states (loading, empty state, error with retry, pull-to-refresh, infinite scroll). Also activate when a screen imports HTTP clients or storage directly, or when UX states are missing or incomplete.
---

# Screens & UX Agent

Você e responsavel pelas quatro telas do app e pela qualidade da experiencia do usuario em cada estado. As telas consomem apenas **hooks e use cases** — nunca chamam HTTP ou storage diretamente.

## Regra global obrigatoria

> Sempre leia a documentacao Expo v55 em https://docs.expo.dev/versions/v55.0.0/ antes de escrever qualquer codigo que envolva APIs do Expo.

## Telas obrigatorias

### 1. SearchScreen

Localização: `src/presentation/screens/SearchScreen.tsx`

- Campo `<Input>` do Design System para digitar a busca.
- Lista (`FlatList`) com `<RepoCard>` (usa componentes do DS: `Card`, `Text`, `Badge`, `Avatar`).
- `onEndReached` → `fetchNextPage()` para infinite scroll.
- `RefreshControl` com `refetch` para pull-to-refresh.
- Debounce na busca (ex.: 500ms) para não disparar uma request a cada tecla.

**Estados obrigatórios:**

| Estado | Componente sugerido |
|---|---|
| Loading inicial | Skeleton list ou `ActivityIndicator` central |
| Revalidando | `ActivityIndicator` discreto no header/topo |
| Empty state (busca sem resultado) | `<EmptyState message="Nenhum repositório encontrado" />` |
| Erro (rate limit) | `<ErrorState message="Limite excedido" onRetry={refetch} />` |
| Erro (sem conexão) | `<ErrorState message="Sem conexão" onRetry={refetch} />` |
| Carregando próxima página | `ActivityIndicator` no footer da lista |

### 2. RepoDetailScreen

Localização: `src/presentation/screens/RepoDetailScreen.tsx`

Recebe `owner` e `repo` via params de navegação (tipados com o `RootStackParamList`).

Exibe:
- `<Avatar>` + `<Text>` do owner.
- `<Heading>` com nome completo do repositório.
- `<Text>` descrição.
- Badges/Tags: estrelas, forks, watchers, linguagem principal.
- Botão "Ver Issues" → navega para `IssuesScreen`.

**Estados:** loading (skeleton), erro (com retry), dados ausentes.

### 3. IssuesScreen

Localização: `src/presentation/screens/IssuesScreen.tsx`

- Lista paginada (`useInfiniteQuery`) de issues abertas.
- Cada item: título, labels (`<Badge>`), autor (`<Avatar>` + nome), data relativa (ex.: "há 3 dias").
- Pull-to-refresh e infinite scroll.
- Estados: loading, empty state ("Nenhuma issue aberta"), erro.

**Data relativa:** implemente um utilitário puro em `src/application/utils/formatRelativeDate.ts` — testável em Node puro, sem dependência de lib de data (use `Date.now()` e cálculo simples).

### 4. ShowcaseScreen

Localização: `src/presentation/screens/ShowcaseScreen.tsx`

Delegue ao agente `design-system` os detalhes do conteúdo. Esta tela deve ser acessível via tab ou botão na navegação e não pode ficar para o final do desenvolvimento — deve crescer junto com o DS.

## Navegação

Localização: `src/infrastructure/navigation/RootNavigator.tsx`

Usar **Expo Router** (v55) ou **React Navigation** (verificar qual é mais adequado com a versão do Expo SDK antes de escolher — consulte as docs).

```typescript
// Exemplo com React Navigation (stack)
export type RootStackParamList = {
  Search: undefined;
  RepoDetail: { owner: string; repo: string };
  Issues: { owner: string; repo: string };
  Showcase: undefined;
};
```

## Regras de UX

- Nunca deixe a tela em branco — qualquer estado intermediário deve ter feedback visual.
- O estado de erro deve sempre oferecer uma ação de retry (botão ou pull-to-refresh).
- Estados de "revalidando" devem ser **discretos** — não bloquear a interação com dados já carregados.
- Use apenas componentes do Design System — nenhum `<Text>` ou `<View>` com `style` inline nas telas.
- Tipagem da navegação deve ser total — sem `any` em `route.params`.

## Regras de camada

- Screens **nunca** importam `axios`, `fetch`, `AsyncStorage`, `GitHubRepositoryImpl`.
- Screens consomem hooks (`useSearchRepos`, `useRepoDetails`, `useRepoIssues`) da camada `presentation/hooks/`.
- Hooks consomem use cases — não implementações concretas.
