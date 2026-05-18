# GitHub Explorer

App React Native (Expo) para busca e exploração de repositórios públicos do GitHub, construído como teste técnico de Desenvolvedor React Native.

Funcionalidades: busca paginada de repositórios, tela de detalhes, lista de issues abertas, showcase interativo do Design System com suporte a tema light/dark, modo offline com cache persistido e buscas recentes.

---

## Stack

| Tecnologia                                | Versão / Detalhes                                         |
| ----------------------------------------- | --------------------------------------------------------- |
| Expo SDK                                  | ~55.0.24                                                  |
| React Native                              | 0.83.6                                                    |
| TypeScript                                | ~5.9.2 (`strict: true`, sem `any`)                        |
| React                                     | 19.2.0                                                    |
| React Navigation                          | v7 (native stack + bottom tabs)                           |
| TanStack Query                            | v5 (`useInfiniteQuery`, stale-while-revalidate)           |
| `@tanstack/react-query-persist-client`    | v5 (`PersistQueryClientProvider` — hidratação offline)    |
| `@tanstack/query-async-storage-persister` | v5 (persister AsyncStorage para TanStack Query)           |
| Axios                                     | v1                                                        |
| @react-native-async-storage/async-storage | v3 (cache persistido em disco)                            |
| @react-native-community/netinfo           | v11.5 (detecção de conectividade)                         |
| @shopify/restyle                          | v2 (tema tipado com tokens)                               |
| @shopify/flash-list                       | v2 (listas de alto desempenho)                            |
| react-native-reanimated                   | v4 (animações nativas — Switch do DS, Skeleton shimmer)   |
| phosphor-react-native                     | v3 (ícones SVG)                                           |
| Jest + RNTL                               | `jest-expo` preset + `@testing-library/react-native` v13  |
| ESLint + Prettier                         | flat config ESM, regras por camada, formato no pre-commit |
| Husky + Commitlint                        | pre-commit (lint + typecheck) + commit-msg (Conventional) |

---

## Pré-requisitos

- Node.js LTS (20+)
- Yarn
- Expo Go (iOS/Android) **ou** simulador/emulador configurado

---

## Instalação e execução

```bash
# Instalar dependências
yarn install

# Iniciar o servidor de desenvolvimento
yarn start

# iOS (simulador)
yarn ios

# Android (emulador)
yarn android

# Lint
yarn lint

# Verificação de tipos
yarn typecheck

# Testes
yarn test

# Testes com cobertura
yarn test:coverage
```

---

## Variáveis de ambiente

A API pública do GitHub permite **60 requisições/hora** sem autenticação. Para aumentar o limite para 5.000 req/hora, configure um token:

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar .env e preencher o token
EXPO_PUBLIC_GITHUB_TOKEN=seu_token_aqui
```

> **Nunca commite o arquivo `.env`.** Ele já está no `.gitignore`.

O prefixo `EXPO_PUBLIC_` é obrigatório para o Expo SDK 53+ expor a variável no bundle — sem ele o token é ignorado em tempo de execução.

---

## Arquitetura

O app segue os princípios de **Clean Architecture** com inversão de dependências entre as camadas, combinado com o padrão **MVVM** na camada de apresentação.

### Camadas

```
src/
├── domain/          # Entidades, interfaces de repositório — zero dependência externa
├── application/     # Use cases — orquestram o domínio sem depender de frameworks
├── presentation/    # Telas, ViewModels (hooks), componentes, navegação — consomem use cases via injeção
└── infrastructure/  # Implementações concretas: HTTP, repositórios, DI, rede, tema
```

> **Nota:** `navigation/` vive em `presentation/` (consome estado de tema), não em `infrastructure/`.

### MVVM sobre Clean Architecture

- **View** → tela React Native (`.tsx` em `screens/`); apenas composição de componentes, zero lógica.
- **ViewModel** → hook React em `viewmodels/` que retorna `[State, Actions]`; consome use cases via `useUseCases()`.
- **Model** → use cases (`application/`) + repositório (`domain/`) + implementação HTTP (`infrastructure/`).

### Princípios aplicados

- **Inversão de Dependência**: `domain/` define `IGitHubRepository`; `infrastructure/` entrega `GitHubRepositoryImpl`. Use cases recebem a interface, nunca a implementação concreta.
- **Domínio isolado**: nenhum import de `react-native`, `expo-*`, `axios`, `@tanstack/react-query` ou qualquer lib dentro de `domain/`. Testável com Node puro.
- **Presentation desacoplada**: telas consomem ViewModels que delegam a use cases — nunca chamam HTTP diretamente.
- **UseCasesContext**: use cases são injetados via `UseCasesProvider` no root — ViewModels consomem `useUseCases()`, sem import estático do `container`. Permite injetar fakes em testes sem `jest.mock`.
- **Componentes como unidade mínima**: nenhum `View`/`Text` cru ou cor hardcoded nas telas. Toda interação visual é um componente.

### Trade-offs e decisões

| Decisão                                                     | Alternativa considerada                               | Por quê esta                                                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **DI por factory simples** (`container.ts` cria singletons) | Container de IoC (InversifyJS, tsyringe)              | Escopo do teste não justifica a complexidade de decorators e configuração de um container completo                  |
| **`ThemeModeContext` separado do Restyle**                  | Usar apenas `ThemeProvider` do Restyle                | Desacopla o sistema de tema de uma lib específica; permite trocar o Restyle no futuro sem refatorar o contexto      |
| **Reanimated para o Switch do DS e Skeleton shimmer**       | `Animated` da RN ou lib de terceiro                   | Animações no thread nativo (worklets) sem janks; consistente com o resto do projeto que já depende de Reanimated    |
| **`useInfiniteQuery` em vez de paginação manual**           | State local com `page` e `concat`                     | Gerenciamento automático de cache, deduplicação de requisições e pull-to-refresh sem boilerplate                    |
| **`FakeGitHubRepository` nos testes**                       | `jest.mock` da implementação concreta                 | Testa o contrato da interface (domínio), não detalhes de implementação; resiste a refatorações internas             |
| **FlashList v2 (sem `estimatedItemSize`)**                  | FlatList nativa                                       | Performance em listas longas; v2 auto-calcula o tamanho estimado, removendo a prop obrigatória da v1                |
| **`PersistQueryClientProvider` + AsyncStorage**             | MMKV ou cache manual                                  | Alinhado com o ecossistema TanStack; hidratação e remoção de entradas expiradas são automáticas, sem código extra   |
| **NetInfo conectado ao `onlineManager` do TanStack**        | Hook manual de retry em cada query                    | TanStack pausa retries automaticamente quando `onlineManager` indica offline; lógica centralizada em um único ponto |
| **`UseCasesContext` em vez de import do `container`**       | Import estático de `container.ts` nos ViewModels      | Permite injetar `FakeGitHubRepository` em testes de ViewModel e screen sem `jest.mock`                              |
| **`isNetInfoLinked` guard + `require` lazy**                | Import top-level de `@react-native-community/netinfo` | Evita crash em ambientes onde o módulo nativo não está linkado (Expo Go, Jest)                                      |

---

## Funcionalidades

- [x] **Busca de repositórios** — campo de busca com debounce, lista paginada (infinite scroll), pull-to-refresh, estados: loading skeleton, empty state, erro (rate limit, sem conexão)
- [x] **Detalhes do repositório** — nome completo, owner (avatar + nome), descrição, estrelas, forks, watchers, linguagem principal, ação para abrir issues
- [x] **Issues do repositório** — lista paginada, título, labels coloridas, autor, data relativa em PT-BR, pull-to-refresh
- [x] **Showcase do Design System** — todos os componentes em todas as variações/estados, switch de tema light/dark animado
- [x] **Dark mode completo** — propaga para componentes DS, navegação (header, tab bar, botão voltar) e status bar
- [x] **Modo offline** — banner persistente quando sem conexão; cache persistido em AsyncStorage (24h) exibe dados da última visita sem nenhuma requisição
- [x] **Buscas recentes** — quando offline ou sem query ativa, exibe lista de buscas anteriores derivada do cache persistido
- [x] **Error boundary global** — captura erros não tratados em qualquer tela e exibe `ErrorState` com opção de retry
- [x] **Skeletons** — placeholders shimmer animados (Reanimated) enquanto carrega, em vez de spinner central

---

## Design System

### Tokens (em `src/presentation/components/ds/tokens.ts`)

Nomenclatura Material Design 3:

| Token        | Chaves principais                                                                                                                                                                                                | Valores base  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `spacing`    | xs, sm, md, lg, xl, xxl, gutterSm, gutterMd, containerMargin                                                                                                                                                     | 4px grid      |
| `colors`     | primary, background, surface, surfaceWhite, surfaceContainer, surfaceContainerHigh, onSurface, onSurfaceVariant, muted, border, outlineVariant, success, warning, warningContainer, danger, error, primaryAction | light + dark  |
| `radius`     | sm, md, lg, full                                                                                                                                                                                                 | 2, 6, 8, 9999 |
| `typography` | fontFamily (Inter, JetBrains Mono), sizes, weights                                                                                                                                                               | —             |

### Componentes base (`src/presentation/components/ds/`)

| Componente    | Variantes / Props controladas                                                                 |
| ------------- | --------------------------------------------------------------------------------------------- |
| `Text`        | `variant` (body, caption, label, h1–h4), `color`                                              |
| `Button`      | `variant` (primary, secondary, success, ghost), `size` (sm/md/lg), `loading`, `disabled`      |
| `Input`       | `leftIcon`, `rightIcon`, estado `focused`                                                     |
| `Card`        | estático ou pressable com feedback                                                            |
| `Badge`       | 6 variantes + dot de linguagem com `languageColors`                                           |
| `Avatar`      | `uri` ou fallback com iniciais, tamanhos xs/sm/md/lg                                          |
| `Switch`      | toggle animado com Reanimated (worklets nativos)                                              |
| `ThemeSwitch` | Switch + ícones ☀️/🌙 ligado ao `ThemeModeContext`                                            |
| `Skeleton`    | shimmer animado (Reanimated + `interpolateColor`) — base para os skeletons de lista e detalhe |

**Restrições aplicadas:** sem `style` livre nas telas, sem cores hardcoded, props tipadas (`variant`, `size`) em vez de estilos inline.

---

## Cache e Persistência

TanStack Query gerencia todo o data fetching; o cache é persistido em disco via AsyncStorage:

- `staleTime`: 5 minutos — dados não revalidam desnecessariamente entre navegações.
- `gcTime`: 24 horas — alinhado com o `maxAge` do persister (dados expirados são descartados automaticamente).
- **Persistência**: `createAsyncStoragePersister` (chave `github-explorer-cache`) + `PersistQueryClientProvider` no root — ao abrir o app offline, dados do último uso são hidratados automaticamente.
- `useInfiniteQuery` para listas paginadas (busca e issues) com `initialPageParam: 1`.
- `refetch` via `RefreshControl` para pull-to-refresh.
- **Retry inteligente**: `NetworkError` não dá retry (inútil offline); outros erros até 2x. `onlineManager` do TanStack é alimentado por `NetInfo.addEventListener` no boot — retries são pausados automaticamente quando offline.
- Query keys padronizadas: `['repos', 'search', query]`, `['repo', owner, name]`, `['issues', owner, name]`.

---

## Testes

```bash
yarn test              # executa todos os testes
yarn test:watch        # modo watch
yarn test:coverage     # gera relatório de cobertura (não versionado)
```

### Estratégia

| Nível                               | Ferramenta                                   | O que cobre                                                      |
| ----------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **Domínio / Use cases** (Node puro) | Jest + `FakeGitHubRepository`                | Use cases, erros de domínio — sem mocks de React Native          |
| **Infraestrutura**                  | Jest + `axios-mock-adapter`                  | Mappers, `GitHubRepositoryImpl`, tratamento de erros HTTP        |
| **Componentes DS**                  | RNTL                                         | Smoke tests: render, variantes, interações, tokens               |
| **Telas**                           | RNTL + `UseCasesProvider` com fakes          | Loading skeleton, success, error, retry, navegação               |
| **ViewModels**                      | `renderHook` + `FakeGitHubRepository`        | Paginação, debounce, pull-to-refresh                             |
| **Hooks de UI**                     | `renderHook` + mocks de NetInfo / QueryCache | `useOnlineStatus`, `useRecentSearches`                           |
| **Componentes comuns**              | RNTL                                         | `OfflineBanner` (mock do hook), `ErrorBoundary` (throw em filho) |
| **Tema**                            | RNTL                                         | Toggle light↔dark, `useColors`                                   |

### Utilitários de teste (`src/test-utils/`)

- `FakeGitHubRepository` — implementa `IGitHubRepository` com `jest.fn()`, sem mocks de módulo.
- `renderWithProviders` — `QueryClient` isolado por teste (retry: false, gcTime: 0) + `ThemeModeProvider` + `UseCasesProvider` + `NavigationContainer` opcional.
- `fixtures/` — objetos de domínio (`Repo`, `Issue`, `Owner`) prontos para uso.
- `apiFixtures/` — respostas brutas da API GitHub (antes dos mappers).

---

## Documentação

- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — padrões de código, lint, formatação e Conventional Commits.
- [`docs/HISTORICO_AGENTES.md`](docs/HISTORICO_AGENTES.md) — histórico de pedidos e resoluções por área de agente, e declaração completa de uso de IA.

---

## Uso de IA

Este projeto utilizou Claude Code (Claude Sonnet 4.6 / Opus 4.7) como auxílio no desenvolvimento. A declaração completa — prompts utilizados, o que foi gerado, o que foi corrigido e o que ficou fora de escopo — está em [`docs/HISTORICO_AGENTES.md`](docs/HISTORICO_AGENTES.md#15-declaração-de-uso-de-ia).

**Resumo:** toda a estrutura de camadas, entidades, mappers, ViewModels, componentes de UI, configuração de ferramentas, persistência offline e suíte de testes foram gerados/assistidos pela IA. Sem `any` em nenhum arquivo. Decisões arquiteturais (DI simplificada, MVVM sobre Clean Architecture, `ThemeModeContext` separado do Restyle, `UseCasesContext` para testabilidade) foram validadas e aprovadas pelo desenvolvedor.

---

## O que faria diferente com mais tempo

- **Autenticação OAuth** em vez de token estático — sem expor credenciais no `.env`.
- **Testes E2E** com Detox — cobertura do fluxo completo de busca → detalhe → issues em dispositivo real.
- **Internacionalização (i18n)** — as strings de UI estão em PT-BR mas sem camada de tradução formal.
- **MMKV** em vez de AsyncStorage para o persister — mais rápido, síncrono, sem serialização manual.
- **Autenticação offline com biometria** — hoje o token fica em `.env`; com mais tempo usaria Keychain/Keystore.

---

## Critérios de avaliação

| Dimensão                                  | Peso        | Status                                                                                        |
| ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| Arquitetura & Desacoplamento              | Alta        | Clean Architecture + MVVM, DI por factory, `UseCasesContext`, domínio isolado                 |
| Qualidade do Código (TS rigoroso)         | Alta        | `strict: true`, sem `any`, imports por alias, ESLint passando                                 |
| Design System                             | Média       | 9 componentes tipados (+ Skeleton), tokens Material 3 light/dark, showcase interativo         |
| UX & Estados                              | Média       | Skeleton, offline banner, error boundary, buscas recentes, infinite scroll, pull-to-refresh   |
| Testes                                    | Média       | Use cases + infra + componentes DS + telas + ViewModels + hooks + ErrorBoundary/OfflineBanner |
| Uso de IA (transparência + senso crítico) | Diferencial | Histórico completo em `docs/HISTORICO_AGENTES.md`                                             |
| README & Commits                          | Baixa       | Conventional Commits, Husky, Commitlint, README atualizado                                    |
