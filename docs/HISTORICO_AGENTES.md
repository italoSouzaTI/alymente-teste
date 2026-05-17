# Histórico de comandos e resoluções por agente

> Registro das solicitações feitas durante o desenvolvimento, agrupadas pela área de responsabilidade dos agentes especializados em `.claude/agents/`. Também serve como **declaração de uso de IA** (item 8 do teste técnico).

---

## Índice

1. [Setup inicial — PDF + agentes + README](#1-setup-inicial)
2. [Architecture Guardian](#2-architecture-guardian)
3. [GitHub API](#3-github-api)
4. [Data & Cache](#4-data--cache)
5. [Design System — tokens e tema](#5-design-system--tokens-e-tema)
6. [Screens & UX — stubs iniciais](#6-screens--ux--stubs-iniciais)
7. [Testing](#7-testing)
8. [Cross-cutting: Tooling (ESLint / Prettier / Husky / Commitlint)](#8-cross-cutting-tooling)
9. [Cross-cutting: MCP Stitch — setup](#9-cross-cutting-mcp-stitch--setup)
10. [Cross-cutting: App shell (providers, navegação, env)](#10-cross-cutting-app-shell)
11. [MCP Stitch — exploração do projeto GitHub Explorer](#11-mcp-stitch--exploração-do-projeto-github-explorer)
12. [Design System — implementação completa](#12-design-system--implementação-completa)
13. [Dark mode — propagação para navegação e status bar](#13-dark-mode--propagação-para-navegação-e-status-bar)
14. [Telas completas — Search, RepoDetail, Issues](#14-telas-completas--search-repodetail-issues)
15. [Declaração de uso de IA](#15-declaração-de-uso-de-ia)

---

## 1. Setup inicial

**Comando do usuário:**

> "leia o documento e crie agente para cada area especifica '/Users/italo/Downloads/Teste Tecnico React Native v2.pdf' e um redme.md com as instruções principais do app, exigidas no teste"

**Resolução:**

| Arquivo criado                            | Propósito                                                         |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `.claude/agents/architecture-guardian.md` | Regras de Clean Architecture, isolamento de camadas, DI           |
| `.claude/agents/design-system.md`         | Tokens Restyle, componentes tipados, sem `style` solto            |
| `.claude/agents/github-api.md`            | HTTP client, mappers, tratamento de erros de API                  |
| `.claude/agents/data-cache.md`            | TanStack Query, `useInfiniteQuery`, stale-while-revalidate        |
| `.claude/agents/testing.md`               | Jest + RNTL, fakes de repositório, testes em Node puro            |
| `.claude/agents/screens-ux.md`            | Stubs de telas, estados UX, tipos de navegação                    |
| `README.md`                               | Documentação principal do projeto (stack, arquitetura, scripts)   |
| `AGENTS.md`                               | Instrução global: ler docs Expo v55 antes de qualquer config Expo |

**Decisões:**

- Um agente por área funcional — permite que sessões futuras tenham contexto isolado e especializado.
- `README.md` gerado com todas as seções exigidas pelo teste (stack, arquitetura, design system, testes, uso de IA, trade-offs).

---

## 2. Architecture Guardian

**Agente responsável:** `.claude/agents/architecture-guardian.md`

**Comando relacionado:**

> "implemente a arquitetura base do app, mas queria criar dentro do patrão MVVM"

**Arquivos criados:**

| Arquivo                                              | Camada         |
| ---------------------------------------------------- | -------------- |
| `src/domain/entities/Repo.ts`                        | Domain         |
| `src/domain/entities/Issue.ts`                       | Domain         |
| `src/domain/entities/Owner.ts`                       | Domain         |
| `src/domain/entities/User.ts`                        | Domain         |
| `src/domain/repositories/IGitHubRepository.ts`       | Domain         |
| `src/domain/errors/GitHubErrors.ts`                  | Domain         |
| `src/application/use-cases/SearchReposUseCase.ts`    | Application    |
| `src/application/use-cases/GetRepoDetailsUseCase.ts` | Application    |
| `src/application/use-cases/GetRepoIssuesUseCase.ts`  | Application    |
| `src/infrastructure/di/container.ts`                 | Infrastructure |

**Decisões-chave:**

- **MVVM mapeado sobre Clean Architecture**: ViewModel = hook React retornando `[State, Actions]`. A View (tela) consome o hook; o hook consome use cases; os use cases recebem o repositório via parâmetro (não o constroem).
- **DI por factory simples** (`container.ts`): cria um `GitHubRepositoryImpl` singleton e injeta nos use cases exportados. Sem container de IoC — escopo do teste não justifica a complexidade.
- **Domínio puro**: nenhum import de `react`, `react-native`, `expo-*`, `axios`, `@tanstack/react-query` ou AsyncStorage dentro de `src/domain/`. Testável em Node puro.
- **`PaginatedResult<T>`** genérico: evita repetição de `{ items, hasNextPage, totalCount? }` nos três endpoints paginados.

---

## 3. GitHub API

**Agente responsável:** `.claude/agents/github-api.md`

**Comando relacionado:** mesmo do item 2 (implementação da arquitetura base).

**Arquivos criados:**

| Arquivo                                                   | Responsabilidade                                             |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| `src/infrastructure/http/httpClient.ts`                   | Instância Axios configurada com base URL e headers do GitHub |
| `src/infrastructure/repositories/GitHubRepositoryImpl.ts` | Implementação concreta de `IGitHubRepository`                |
| `src/infrastructure/repositories/types/githubApiTypes.ts` | Tipos da resposta bruta da API (sem `any`)                   |
| `src/infrastructure/mappers/repoMapper.ts`                | `GitHubApiRepo` → `Repo`                                     |
| `src/infrastructure/mappers/issueMapper.ts`               | `GitHubApiIssue` → `Issue`                                   |
| `src/infrastructure/mappers/ownerMapper.ts`               | `GitHubApiOwner` → `Owner`                                   |

**Decisões-chave:**

- **Imports nomeados de `axios`**: `import { create } from 'axios'` e `import { isAxiosError } from 'axios'` — evita o warning `import/no-named-as-default-member` do ESLint.
- **Mapeamento de erros**: `handleAxiosError` centraliza o tratamento — sem `response` → `NetworkError`; status 403/429 → `RateLimitError`; qualquer outro → `UnknownApiError(statusCode)`.
- **`EXPO_PUBLIC_GITHUB_TOKEN`**: Expo SDK 53+ aceita `EXPO_PUBLIC_*` nativamente; sem necessidade de `babel-plugin-module-resolver`.

**Erros encontrados e corrigidos:**

| Erro                                                             | Causa                                                           | Correção                              |
| ---------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| `import/no-named-as-default-member` (2x)                         | `axios.create` e `axios.isAxiosError` usados via default import | Trocado para imports nomeados diretos |
| Chamada `axios.isAxiosError(error)` persistia após trocar import | Esqueceu de atualizar a chamada junto com o import              | Corrigido para `isAxiosError(error)`  |

---

## 4. Data & Cache

**Agente responsável:** `.claude/agents/data-cache.md`

**Comando relacionado:** mesmo do item 2.

**Arquivos criados:**

| Arquivo                                                 | Responsabilidade                         |
| ------------------------------------------------------- | ---------------------------------------- |
| `src/presentation/viewmodels/useSearchViewModel.ts`     | `useInfiniteQuery` para busca paginada   |
| `src/presentation/viewmodels/useRepoDetailViewModel.ts` | `useQuery` para detalhes do repositório  |
| `src/presentation/viewmodels/useIssuesViewModel.ts`     | `useInfiniteQuery` para issues paginadas |
| `src/presentation/providers/queryClient.ts`             | Instância singleton do `QueryClient`     |

**Decisões-chave:**

- **`useInfiniteQuery`** com `initialPageParam: 1` e `getNextPageParam` baseado em `hasNextPage` do `PaginatedResult`.
- **`staleTime: 5 min`** — busca de repositórios não revalida desnecessariamente entre navegações.
- **QueryKeys padronizadas**: `['repos', 'search', query]`, `['repo', owner, name]`, `['issues', owner, name]` — permite invalidação seletiva futura.
- **ViewModel retorna `[State, Actions]`**: desestruturação clara na tela (`const [state, actions] = useSearchViewModel()`).

---

## 5. Design System — tokens e tema

**Agente responsável:** `.claude/agents/design-system.md`

**Comando relacionado:** mesmo do item 2 (arquitetura base inclui tema).

**Arquivos criados:**

| Arquivo                             | Responsabilidade                                                  |
| ----------------------------------- | ----------------------------------------------------------------- |
| `src/infrastructure/theme/theme.ts` | Tokens Restyle: colors (light+dark), spacing, radii, textVariants |

**Decisões-chave:**

- **`@shopify/restyle` + `createTheme`**: tipagem automática dos tokens; props `color`, `backgroundColor`, `padding`, etc. verificadas em tempo de compilação.
- **Tema light e dark**: exporta `theme` (light) e `darkTheme`. `AppProviders` seleciona via `useColorScheme()`.
- **`textVariants`**: `h1–h4`, `body`, `caption`, `label` com `defaults` apontando para fonte e cor base.

> **Componentes implementados na Sessão 2 — ver [seção 12](#12-design-system--implementação-completa).**

---

## 6. Screens & UX — stubs iniciais

**Agente responsável:** `.claude/agents/screens-ux.md`

**Comando relacionado:** mesmo do item 2.

**Arquivos criados:**

| Arquivo                                           | Responsabilidade                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/infrastructure/navigation/types.ts`          | `ExploreStackParamList`, `RootTabParamList`, props tipadas de cada tela |
| `src/infrastructure/navigation/RootNavigator.tsx` | Bottom tabs (Explore + Showcase) + native stack interno                 |
| `src/presentation/screens/SearchScreen.tsx`       | Stub: consome `useSearchViewModel`                                      |
| `src/presentation/screens/RepoDetailScreen.tsx`   | Stub: consome `useRepoDetailViewModel`                                  |
| `src/presentation/screens/IssuesScreen.tsx`       | Stub: consome `useIssuesViewModel`                                      |
| `src/presentation/screens/ShowcaseScreen.tsx`     | Stub: placeholder dos componentes do DS                                 |

**Decisões-chave:**

- **Bottom tabs** (Explore + Showcase) com `headerShown: false` no Explore para o header ser gerenciado pelo stack interno.
- **Native Stack**: Search → RepoDetail → Issues, com parâmetros tipados (`owner`, `repo`, `repoName`).
- **Stubs com `eslint-disable`**: as telas não evoluem até os componentes do DS existirem; o `eslint-disable` é temporário e documentado com TODO.

**Erros encontrados e corrigidos:**

| Erro                                     | Causa                                                    | Correção                                 |
| ---------------------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| `'navigation' is defined but never used` | `SearchScreen` desestruturava `navigation` mas não usava | Trocado para `_props: SearchScreenProps` |

> **Telas totalmente implementadas na Sessão 2 — ver [seção 14](#14-telas-completas--search-repodetail-issues).**

---

## 7. Testing

**Agente responsável:** `.claude/agents/testing.md`

**Comando relacionado:** setup geral da arquitetura.

**Status atual:**

- Scripts `test`, `test:watch`, `test:coverage` registrados no `package.json`.
- `jest-expo` preset, `@testing-library/react-native` e arquivo de setup **não instalados/configurados** nesta sessão.
- Estratégia planejada: use cases testados com `FakeGitHubRepository` (implementa `IGitHubRepository`) em Node puro; smoke tests de componentes com RNTL.

---

## 8. Cross-cutting: Tooling

**Comando do usuário:**

> "instale o ESLint/Prettier e configure de acordo com as regras impostas [...] todos os alertas devem ser bem descritos [...] utilize o Conventional Commits para poder subir o commit para o repositório"

**Arquivos criados / modificados:**

| Arquivo                   | Responsabilidade                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `eslint.config.mjs`       | Flat config ESM: regras base Expo, boundaries por camada, `prettier/prettier`, mensagens didáticas PT-BR                |
| `.prettierrc.json`        | `singleQuote`, `semi`, `trailingComma: all`, `printWidth: 100`                                                          |
| `.prettierignore`         | Exclui `node_modules`, `.expo`, `dist`, `coverage`                                                                      |
| `commitlint.config.js`    | `@commitlint/config-conventional`; `subject-case: off` (suporte PT-BR); `header-max-length: 100`                        |
| `.husky/pre-commit`       | `yarn lint-staged && yarn typecheck`                                                                                    |
| `.husky/commit-msg`       | `yarn commitlint --edit "$1"`                                                                                           |
| `package.json`            | Scripts: `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `prepare`; seção `lint-staged`; devDependencies     |
| `docs/CONTRIBUTING.md`    | Guia PT-BR: fluxo completo, regras por camada, Conventional Commits, troubleshooting                                    |
| `.vscode/settings.json`   | `eslint.useFlatConfig: true`, format on save, Prettier como formatador padrão                                           |
| `.vscode/extensions.json` | ESLint, Prettier, TypeScript, Expo Tools                                                                                |
| `.gitignore`              | Adicionados `.env` e `.env.local` (antes apenas `.env*.local` era ignorado — risco de vazar `EXPO_PUBLIC_GITHUB_TOKEN`) |
| `.env.example`            | `EXPO_PUBLIC_GITHUB_TOKEN=` (atualizado de `GITHUB_TOKEN=` para o prefixo correto do Expo)                              |

**Decisões-chave:**

- **Flat config ESM (`.mjs`)**: padrão do ESLint 9+; compatível com `eslint-config-expo` v9.
- **`createRequire` de `module`**: `eslint-config-expo` é CJS — necessário para importar em contexto ESM sem erro de `ERR_UNSUPPORTED_DIR_IMPORT`.
- **Boundaries por `no-restricted-imports`**: sem plugin extra; mensagens de erro indicam a camada errada E para onde o código deveria ir.
- **Pre-commit rápido**: `lint-staged` (lint+fix+format apenas nos arquivos staged) + `tsc --noEmit`. Testes ficam fora do pre-commit para não engessar o fluxo.

**Erros encontrados e corrigidos:**

| Erro                                                  | Causa                               | Correção                                                                        |
| ----------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- |
| `ERR_UNSUPPORTED_DIR_IMPORT: eslint-config-expo/flat` | Import de diretório em contexto ESM | Trocado para `eslint-config-expo/flat.js` (arquivo explícito) + `createRequire` |
| 11 erros de Prettier em arquivos existentes           | Arquivos gerados sem formatação     | `yarn lint:fix` auto-corrigiu                                                   |

---

## 9. Cross-cutting: MCP Stitch — setup

**Comandos do usuário:**

```
claude mcp add stitch \
  --transport http \
  --header "X-Goog-Api-Key: <token>" \
  https://stitch.googleapis.com/mcp
```

e depois: `claude mcp list`, `claude mcp auth "claude.ai Google Drive"`

**Resolução:**

O CLI do Claude Code exige que `name` e `URL` venham antes das flags. Comando que funcionou:

```bash
claude mcp add stitch https://stitch.googleapis.com/mcp \
  -t http \
  -H "X-Goog-Api-Key: <token>"
```

Verificado com `claude mcp list` (stitch aparece na lista de servidores).

> A chave de API do Stitch não é commitada — permanece apenas na configuração local do Claude Code.

---

## 10. Cross-cutting: App shell

**Comando relacionado:** implementação da arquitetura base.

**Arquivos criados / modificados:**

| Arquivo                                       | Responsabilidade                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `App.tsx`                                     | Entry point reduzido: renderiza apenas `<AppProviders />`                                   |
| `src/presentation/providers/AppProviders.tsx` | `QueryClientProvider` + `ThemeProvider` (light/dark) + `SafeAreaProvider` + `RootNavigator` |
| `.env.example`                                | Placeholder `EXPO_PUBLIC_GITHUB_TOKEN=` para orientar setup do desenvolvedor                |
| `.gitignore`                                  | `.env` e `.env.local` adicionados explicitamente                                            |

---

## 11. MCP Stitch — exploração do projeto GitHub Explorer

**Comandos do usuário:**

> "acesse o mpc do stitch e acesse o projeto `projects/1788894762598779937`"
> "lista as telas do projeto"
> "gerar todos os componentes usados no projeto"

**Resolução:**

Ferramentas MCP Stitch utilizadas: `mcp__stitch__get_project` e `mcp__stitch__list_screens`.

**Projeto encontrado:** "GitHub Explorer" — tipo `TEXT_TO_UI_PRO`, dispositivo `MOBILE`, design system "Source Velocity".

**Design system Source Velocity — especificações extraídas:**

| Token           | Valores                              |
| --------------- | ------------------------------------ |
| Fonte principal | Inter (body/headline/label)          |
| Fonte mono      | JetBrains Mono (hashes, diff)        |
| Cor primária    | `#0969da` (GitHub blue)              |
| Cor success     | `#1f883d` (GitHub green)             |
| Background      | `#f8f9fb` (light) / `#0d1117` (dark) |
| Radius          | sm=2 · md=6 · lg=8 · full=9999       |
| Spacing base    | 4px grid, container-margin=16px      |

**Telas listadas (5 visíveis):**

| Tela                      | ID         |
| ------------------------- | ---------- |
| Repository Issues v2      | `dc892e55` |
| Home Feed v2              | `8da742f7` |
| Design System Showcase v2 | `57ba8f0d` |
| Repo Details v2           | `9a877c45` |
| Search v2                 | `c0f11e8c` |

---

## 12. Design System — implementação completa

**Agente responsável:** `.claude/agents/design-system.md`

**Comandos do usuário:**

> "gerar todos os componentes usados no projeto"
> "tem que ter o designer token"
> "crie a tela de design system ativando modo dark mode por um switch [...] todos as interações e telas visuais tem que ser um componente não pode ser injetado na tela diretamente"
> "emoji ta corando os emoji" (correção de emoji tintado no Android)

**Arquivos criados:**

| Arquivo                                                        | Responsabilidade                                                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/presentation/components/ds/tokens.ts`                     | `lightColors`, `darkColors`, `typography`, `spacing`, `radii`, `languageColors`, `getLanguageColor` |
| `src/presentation/components/ds/Text.tsx`                      | DS Text com variantes e cores reativos ao tema                                                      |
| `src/presentation/components/ds/Button.tsx`                    | DS Button — primary / secondary / success / ghost, tamanhos sm/md/lg, loading, disabled             |
| `src/presentation/components/ds/Input.tsx`                     | DS Input com suporte a ícones esquerda/direita e estado focused                                     |
| `src/presentation/components/ds/Card.tsx`                      | DS Card — estático ou pressable com feedback de press                                               |
| `src/presentation/components/ds/Badge.tsx`                     | DS Badge — 6 variantes + dot de linguagem                                                           |
| `src/presentation/components/ds/Avatar.tsx`                    | DS Avatar — uri ou fallback com initials, tamanhos xs/sm/md/lg                                      |
| `src/presentation/components/ds/Switch.tsx`                    | Toggle animado custom (Reanimated) sem usar o `Switch` do RN                                        |
| `src/presentation/components/ds/ThemeSwitch.tsx`               | Switch + ícones ☀️/🌙 ligado ao `ThemeModeContext`                                                  |
| `src/presentation/components/ds/index.ts`                      | Barrel de todos os componentes DS                                                                   |
| `src/presentation/theme/ThemeModeContext.tsx`                  | `ThemeModeProvider` + `useThemeMode()` — estado `light/dark` controlado pelo usuário                |
| `src/presentation/theme/useColors.ts`                          | Hook `useColors()` — devolve `lightColors` ou `darkColors` conforme modo ativo                      |
| `src/presentation/theme/index.ts`                              | Barrel do módulo de tema                                                                            |
| `src/presentation/components/showcase/ShowcaseLayout.tsx`      | ScrollView themed com safe area                                                                     |
| `src/presentation/components/showcase/ShowcaseHeader.tsx`      | Título + `ThemeSwitch`                                                                              |
| `src/presentation/components/showcase/ShowcaseSection.tsx`     | Container de seção com título e borda themed                                                        |
| `src/presentation/components/showcase/ColorSwatch.tsx`         | Quadrado de cor + label + valor hex                                                                 |
| `src/presentation/components/showcase/ColorPaletteSection.tsx` | Grid de 8 swatches da paleta ativa                                                                  |
| `src/presentation/components/showcase/TypographySection.tsx`   | Amostra das 9 variantes tipográficas                                                                |
| `src/presentation/components/showcase/ButtonsSection.tsx`      | Todas as variantes e tamanhos de botão                                                              |
| `src/presentation/components/showcase/InputsSection.tsx`       | Input simples + input com ícone e limpar                                                            |
| `src/presentation/components/showcase/CardsSection.tsx`        | Card estático + card pressable                                                                      |
| `src/presentation/components/showcase/BadgesSection.tsx`       | 6 variantes + 3 badges com dot de linguagem                                                         |
| `src/presentation/components/showcase/AvatarsSection.tsx`      | 4 tamanhos com foto + 4 com fallback                                                                |
| `src/presentation/components/showcase/index.ts`                | Barrel das sections                                                                                 |

**Decisões-chave:**

- **`ThemeModeContext` separado do Restyle**: o contexto controla apenas o estado `light/dark` e expõe `toggle()`. O `ThemeProvider` do Restyle é alimentado por um `Bridges` interno que lê esse contexto — mantém compatibilidade com código Restyle futuro sem acoplar o DS a ele.
- **Componentes DS theme-aware via `useColors()`**: nenhum componente importa `colors` estático. Ao trocar de modo, todos reagem automaticamente.
- **`Switch` com Reanimated**: usa `useSharedValue` para posição do thumb e `useDerivedValue` + `interpolateColor` para a cor do track. Cores da paleta ficam em shared values reativos (`offColor`, `onColor`) atualizados por `useEffect` quando o tema muda — evita o problema de worklets com closures obsoletas.
- **Emojis com `Text` nativo do RN**: o DS `Text` aplica `color: c.onSurface` que no Android tinta emojis com a cor do texto. Solucionado usando `Text as RNText` do `react-native` para todos os emojis (EmptyState, ErrorState, StatCard).
- **`languageColors` em `tokens.ts`**: cores GitHub Linguist extraídas como constante do DS — centralizadas, sem duplicação entre `RepoCard` e `BadgesSection`.
- **`ShowcaseScreen` — composição pura**: a tela não contém nenhum `View`/`Text` cru nem `StyleSheet`. É apenas orquestração de `<ShowcaseLayout>` + sections.

**Erros encontrados e corrigidos:**

| Erro                                                             | Causa                                                   | Correção                                                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `TS2769` no `Avatar`: `ViewStyle` não atribuível a `ImageStyle`  | Prop `style?: ViewStyle` passada para `<Image>`         | Removida a prop `style` do Avatar; dimensões controladas via `width/height` inline |
| `TS2322` no `InputsSection`: `onPress` não existe em `IconProps` | `phosphor-react-native` não aceita `onPress` nos ícones | Ícone envolvido em `<Pressable>`                                                   |
| `estimatedItemSize` não existe em `FlashListProps`               | `@shopify/flash-list` v2 removeu a prop                 | Removida; v2 auto-calcula o tamanho                                                |

---

## 13. Dark mode — propagação para navegação e status bar

**Comando do usuário:**

> "um problema que identifique e que esse dark mode tem que percorre todo app atualmente so ta mudando a tela, então você tem que colar no navigation pra trocar as cores também"

**Problema identificado:**

O `NavigationContainer` não recebia a prop `theme`, então React Navigation usava sempre o `DefaultTheme` (branco). Header, tab bar e status bar ficavam em light independente do modo selecionado pelo usuário.

**Arquivos modificados:**

| Arquivo                                           | Mudança                                                                                                                                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/infrastructure/navigation/RootNavigator.tsx` | Constrói `navTheme: Theme` a partir de `lightColors`/`darkColors`; passa para `<NavigationContainer theme={navTheme}>`. Adiciona `screenOptions` nos dois navigators com cores do header, tab bar, tintColor e borda |
| `src/presentation/providers/AppProviders.tsx`     | `RestyleBridge` + `StatusBarBridge` unificados em `Bridges`; adiciona `<StatusBar style={isDark ? 'light' : 'dark'} />` do `expo-status-bar`                                                                         |

**Decisões-chave:**

- **`navTheme` construído via spread de `DefaultTheme`/`DarkTheme`** do React Navigation — garante que todas as chaves exigidas pelo tipo `Theme` estejam presentes, sobrescrevendo apenas as que usam a paleta do projeto.
- **`headerShadowVisible: false`** — visual clean alinhado com Source Velocity; separação visual feita pela diferença de `backgroundColor` entre header e content.
- **Ícones na tab bar** via `phosphor-react-native`: `MagnifyingGlass` (Explorar) e `PaintBrush` (Design System). Recebem `color` e `size` do React Navigation e reagem automaticamente ao estado ativo/inativo.

---

## 14. Telas completas — Search, RepoDetail, Issues

**Agente responsável:** `.claude/agents/screens-ux.md`

**Comandos do usuário:**

> "crie a tela de pesquisa do projeto e preste atenção nas mudanças de cores no dark esta com problema e coloque os icones na bottom navigation"
> "agora crie a tela de detalhe do repositório"
> "crie a tela de issues"
> "a tela de buscar esta cortando" (bug Android — input oculto atrás do header)

**Regra aplicada em todas as telas:** nenhum `View`/`Text` cru ou cor hardcoded na tela. Tudo delegado a componentes.

---

### 14.1 SearchScreen

**Arquivos criados:**

| Arquivo                                                      | Responsabilidade                                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/presentation/components/search/SearchBar.tsx`           | Input com ícone lupa + botão limpar (XCircle), sem `containerStyle` conflitante           |
| `src/presentation/components/search/SearchResultsHeader.tsx` | "X resultados para 'query'" com contagem formatada                                        |
| `src/presentation/components/search/RepoListFooter.tsx`      | Spinner de carregamento adicional ou "— Fim dos resultados —"                             |
| `src/presentation/components/search/RepoList.tsx`            | FlashList com pull-to-refresh, infinite scroll e os 4 estados (loading/error/empty/lista) |
| `src/presentation/components/search/index.ts`                | Barrel                                                                                    |
| `src/presentation/components/common/EmptyState.tsx`          | Estado vazio reutilizável (emoji sem tintagem + título + descrição)                       |
| `src/presentation/components/common/ErrorState.tsx`          | Erro com botão retry                                                                      |
| `src/presentation/components/common/LoadingSpinner.tsx`      | `ActivityIndicator` themed, opção `fullScreen`                                            |
| `src/presentation/components/common/index.ts`                | Barrel                                                                                    |
| `src/presentation/components/repo/RepoCard.tsx`              | Card de repositório com linguagem, estrelas, forks, issues                                |
| `src/presentation/components/repo/index.ts`                  | Barrel                                                                                    |
| `src/presentation/screens/SearchScreen.tsx`                  | Composição: `SearchBar` + `RepoList`                                                      |

**Bug corrigido — input cortado no Android:**

| Causa                                                                                                                          | Correção                                                    |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `contentStyle: { backgroundColor }` no `ExploreStack.Navigator` causa o conteúdo iniciar em `y=0` (atrás do header) no Android | Removido `contentStyle`; fundo controlado pela própria tela |
| `containerStyle={{ flex: 1 }}` no `Input` conflitava com `height: 44` no Yoga (Android)                                        | Removido `containerStyle`; `Input` usa seu tamanho natural  |

---

### 14.2 RepoDetailScreen

**Arquivos criados:**

| Arquivo                                                         | Responsabilidade                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `src/presentation/components/repo-detail/RepoDetailLayout.tsx`  | ScrollView themed com safe area                                     |
| `src/presentation/components/repo-detail/RepoDetailHeader.tsx`  | Avatar do owner + nome do repo + descrição + badge de linguagem     |
| `src/presentation/components/repo-detail/StatCard.tsx`          | Métrica individual: emoji (sem tintagem) + número formatado + label |
| `src/presentation/components/repo-detail/RepoDetailStats.tsx`   | Row com 4 StatCards: Stars, Forks, Watchers, Issues                 |
| `src/presentation/components/repo-detail/RepoDetailActions.tsx` | Card clicável de issues + botão "Ver todas as issues"               |
| `src/presentation/components/repo-detail/index.ts`              | Barrel                                                              |
| `src/presentation/screens/RepoDetailScreen.tsx`                 | Composição: Loading → Error → Layout com Header + Stats + Actions   |

**Decisões-chave:**

- **Navegação para Issues via callback**: `RepoDetailScreen` usa `useNavigation` e passa `onViewIssues` como prop para `RepoDetailActions` — componente não conhece o navigator.
- **`StatCard` com `RNText` nativo** para emojis (⭐🍴👁️🐛): evita tintagem.
- **`formatCount`** formata números ≥ 1k como `1.4k`, ≥ 1M como `2.3M`.

---

### 14.3 IssuesScreen

**Arquivos criados:**

| Arquivo                                                      | Responsabilidade                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `src/presentation/components/issues/IssueStateIndicator.tsx` | Círculo colorido com ícone `GitPullRequest` (open) ou `XCircle` (closed)             |
| `src/presentation/components/issues/IssueLabelChip.tsx`      | Label colorida derivando bg/border do hex da própria label com alpha                 |
| `src/presentation/components/issues/IssueItem.tsx`           | Row completa: indicador + título + labels + número + data relativa + avatar do autor |
| `src/presentation/components/issues/IssueList.tsx`           | FlashList com pull-to-refresh, infinite scroll e estados; reutiliza `RepoListFooter` |
| `src/presentation/components/issues/index.ts`                | Barrel                                                                               |
| `src/presentation/screens/IssuesScreen.tsx`                  | Composição: `View` de container + `IssueList`                                        |

**Decisões-chave:**

- **`IssueLabelChip` sem tokens fixos**: converte o hex da label (`Label.color`) para `rgba` com alpha 0.18 (fundo) e 0.5 (borda). Funciona em light e dark sem precisar de paleta.
- **Data relativa sem lib**: helper `formatRelativeDate` cobre minutos → horas → dias → meses → anos em PT-BR.
- **`IssueList` reutiliza `RepoListFooter`**: spinner de carregamento e mensagem de fim de lista compartilhados entre as duas listas infinitas.

---

## 15. Declaração de uso de IA

**Modelo:** Claude Code (Claude Sonnet 4.6) via CLI da Anthropic.

### Prompts utilizados (ordem cronológica)

**Sessão 1:**

1. Visualizar o arquivo `CLAUDE.md`.
2. Ler PDF do teste técnico e criar agentes especializados + `README.md`.
3. Instalar e configurar ESLint/Prettier com guardião de padrões e Conventional Commits.
4. Configurar MCP server do Stitch.
5. Listar servidores MCP.
6. Autenticar Google Drive via MCP.
7. Implementar a arquitetura base do app no padrão MVVM.
8. Criar este arquivo de histórico de comandos e resoluções por agente.

**Sessão 2:** 9. Acessar projeto Stitch `projects/1788894762598779937` e listar telas. 10. Gerar todos os componentes do projeto (Design System completo + tokens). 11. Criar tela de Design System com toggle de dark mode animado. 12. Propagar dark mode para a navegação e status bar. 13. Criar tela de pesquisa (SearchScreen completa com FlashList + estados). 14. Adicionar ícones na bottom navigation. 15. Criar tela de detalhe do repositório (RepoDetailScreen). 16. Criar tela de issues (IssuesScreen). 17. Corrigir SearchBar cortado no Android (`contentStyle` + `flex: 1` no Input). 18. Corrigir emojis tintados no Android (`Text` nativo para emojis). 19. Atualizar este arquivo de histórico.

### O que foi gerado/assistido por IA

- Todos os arquivos listados nas seções 1–14 foram propostos e criados pela IA.
- Estrutura de camadas, tipos de entidades, mappers, ViewModels, configurações de ferramentas e todos os componentes de UI foram inteiramente gerados pela IA com base nas instruções do usuário, regras dos agentes especializados e especificações extraídas do Stitch.

### O que a IA corrigiu durante o próprio fluxo

**Sessão 1:**

- Substituição de `axios.create` / `axios.isAxiosError` por imports nomeados.
- Uso de `eslint-config-expo/flat.js` com `createRequire` para flat config ESM.
- Atualização do `.env.example` para `EXPO_PUBLIC_GITHUB_TOKEN=`.
- Correção do argumento `_props` em `SearchScreen` após warning de variável não usada.

**Sessão 2:**

- `TS2769` no Avatar: `ViewStyle` incompatível com `ImageStyle` na prop `style` do `<Image>`.
- `TS2322` no `InputsSection`: `onPress` não existe em `IconProps` do phosphor — envolvido em `<Pressable>`.
- `estimatedItemSize` removido (FlashList v2 não tem essa prop).
- `withTiming` dentro de `useAnimatedStyle` (anti-pattern Reanimated) → migrado para `useSharedValue` + `useDerivedValue`.
- `contentStyle` no native stack removido após identificar que causava `y=0` no Android.
- `containerStyle={{ flex: 1 }}` removido do Input no SearchBar (conflito com `height: 44` no Yoga/Android).
- Emojis tintados corrigidos com `Text as RNText` do react-native nativo.
- `languageColors` centralizado em `tokens.ts` após linter/usuário identificar duplicação no `RepoCard`.

### Avaliação crítica

A IA acelerou significativamente o scaffolding, a configuração de ferramentas e a implementação de UI. O desenvolvedor validou cada decisão — em particular:

- **DI simplificada** (factory em vez de IoC container) foi decisão consciente de escopo.
- **`ThemeModeContext` separado do Restyle** foi escolha arquitetural deliberada para não acoplar o sistema de tema a uma lib específica.
- **Componentes como unidade mínima** — a regra "nenhum `View`/`Text` cru nas telas" foi definida pelo usuário e respeitada em todas as screens.
- **Sem `any`** — restrição do ESLint aplicada desde o início, sem exceção adicionada.
- **Dark mode completo** — propagado para componentes DS, navegação (header, tab bar, botão voltar), status bar e transições entre telas.
