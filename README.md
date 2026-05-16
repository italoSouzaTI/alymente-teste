# GitHub Explorer

App React Native (Expo) para busca e exploração de repositórios públicos do GitHub, construído como teste técnico de Desenvolvedor React Native.

Funcionalidades: busca paginada de repositórios, tela de detalhes, lista de issues abertas e showcase interativo do Design System com suporte a tema light/dark.

---

## Stack

| Tecnologia        | Versão / Detalhes                                |
| ----------------- | ------------------------------------------------ |
| Expo SDK          | ~55.0.24                                         |
| React Native      | 0.83.6                                           |
| TypeScript        | ~5.9.2 (strict: true)                            |
| React             | 19.2.0                                           |
| TanStack Query    | v5 (cache, paginação, pull-to-refresh)           |
| Jest + RNTL       | jest-expo preset + @testing-library/react-native |
| ESLint + Prettier | configurados e passando no CI                    |

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

# Testes
yarn test

# Testes com cobertura
yarn test:coverage

# Lint
yarn lint
```

---

## Variáveis de ambiente

A API pública do GitHub permite **60 requisições/hora** sem autenticação. Para aumentar o limite para 5.000 req/hora, configure um token:

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar .env e preencher o token
GITHUB_TOKEN=seu_token_aqui
```

> **Nunca commite o arquivo `.env`.** Ele já está no `.gitignore`.

---

## Arquitetura

O app segue os princípios de **Clean Architecture** com inversão de dependências entre as camadas.

### Camadas

```
src/
├── domain/          # Entidades, interfaces de repositório — zero dependência externa
├── application/     # Use cases — orquestram o domínio sem depender de frameworks
├── presentation/    # Telas, componentes, hooks de UI — consomem use cases via injeção
└── infrastructure/  # Implementações concretas: HTTP, repositórios, DI, navegação, tema
```

### Princípios aplicados

- **Inversão de Dependência**: regras de negócio (`domain/`) não dependem de detalhes de infra (HTTP, AsyncStorage, React Query). A interface vive no domínio; a implementação concreta fica em `infrastructure/`.
- **Interfaces antes de implementações**: `IGitHubRepository` é definida no domínio e implementada por `GitHubRepositoryImpl` na infraestrutura.
- **Domínio isolado**: nenhum import de `react-native`, `expo-*`, `axios`, `@tanstack/react-query` ou AsyncStorage dentro de `domain/`. Testável com Node puro.
- **Camada de application separada**: use cases recebem repositórios via injeção de dependência — nunca instanciam implementações concretas.
- **Presentation desacoplada**: telas consomem hooks (`useSearchRepos`, `useRepoDetails`, `useRepoIssues`) que delegam a use cases — nunca chamam HTTP diretamente.

### Trade-offs e decisões

<!-- TODO: preencher durante a implementação. Exemplo:
- Por que escolhi factory functions em vez de um container de DI completo?
- Por que preferi Expo Router / React Navigation?
- Quais simplificações foram feitas pelo escopo do teste?
-->

---

## Funcionalidades

- [x] **Busca de repositórios** — campo de busca com debounce, lista paginada (infinite scroll), pull-to-refresh, estados: loading, empty state, erro (rate limit, sem conexão)
- [x] **Detalhes do repositório** — nome completo, owner (avatar + nome), descrição, estrelas, forks, watchers, linguagem principal, ação para abrir issues
- [x] **Issues do repositório** — lista paginada, título, labels, autor, data relativa, pull-to-refresh
- [x] **Showcase do Design System** — todos os componentes em todas as variações/estados, switch de tema light/dark

---

## Design System

### Tokens

| Token     | Chaves                                                                      | Valores             |
| --------- | --------------------------------------------------------------------------- | ------------------- |
| `spacing` | xs, sm, md, lg, xl                                                          | 4, 8, 16, 24, 32    |
| `sizes`   | xs, sm, md, lg, xl                                                          | tipografia e ícones |
| `colors`  | primary, background, surface, text, muted, border, success, warning, danger | light + dark        |
| `radius`  | sm, md, lg                                                                  | 4, 8, 16            |

### Componentes base

| Componente       | Variants / Props controladas                                            |
| ---------------- | ----------------------------------------------------------------------- |
| `Text / Heading` | variant (body, caption, label / h1–h4), size, color                     |
| `Button`         | variant (primary, outline, ghost), size (sm, md, lg), loading, disabled |
| `Input`          | label, value, error, helperText                                         |
| `Card / Surface` | —                                                                       |
| `Badge / Tag`    | tone (default, success, warning, danger, info)                          |
| `Avatar`         | uri, name (fallback com iniciais), size                                 |

**Restrições:** sem `style` livre nas telas, sem componentes não tipados, props controladas (`variant`, `size`, `tone`) em vez de estilos inline.

---

## Cache

TanStack Query gerencia todo o data fetching:

- `staleTime`: 5 minutos — dados não revalidam desnecessariamente.
- `gcTime`: 10 minutos — cache mantido em memória após desmontagem.
- `useInfiniteQuery` para listas paginadas (busca e issues).
- `refetch` via `RefreshControl` para pull-to-refresh.
- Estados de revalidação discretos — não bloqueiam dados já carregados.

---

## Testes

```bash
yarn test              # executa todos os testes
yarn test:coverage     # gera relatório de cobertura
```

Estratégia:

- **Use cases do domínio** (prioridade): testados com `FakeGitHubRepository` (implementa a interface do domínio) — rodáveis em Node puro, sem mocks de React Native.
- **Smoke tests de componentes**: `@testing-library/react-native` valida renderização e interações básicas dos componentes do Design System.

---

## Uso de IA

Este projeto utilizou ferramentas de IA (Claude Code / Claude Sonnet) como auxílio no desenvolvimento. Em conformidade com a política do teste técnico, segue a declaração de uso:

### O que foi gerado ou fortemente assistido por IA

<!-- TODO: preencher ao longo do desenvolvimento. Exemplo:
- Scaffolding inicial dos arquivos de agentes especializados e README
- Estrutura de tipos das entidades de domínio (Repo, Issue, Owner)
- Configuração do QueryClient e hooks de useInfiniteQuery
-->

### Prompts / instruções utilizados

<!-- TODO: documentar os prompts principais ao longo do desenvolvimento. -->

### O que foi modificado, revisado ou rejeitado

<!-- TODO: registrar decisões críticas onde o output da IA foi ajustado. Exemplo:
- Rejeitei sugestão de usar `any` no mapper — substituí por tipos explícitos da API do GitHub.
- Ajustei a estrutura de DI sugerida — a IA propôs um container complexo; simplifiquei para factory functions dado o escopo do teste.
-->

---

## O que faria diferente com mais tempo

<!-- TODO: preencher ao final do desenvolvimento. Exemplos:
- Adicionar autenticação OAuth para aumentar o rate limit sem expor token
- Persistência de cache com MMKV ou AsyncStorage para experiência offline real
- Testes de integração E2E com Detox
- Internacionalização (i18n)
-->

---

## Critérios de avaliação

| Dimensão                                  | Peso        | Status        |
| ----------------------------------------- | ----------- | ------------- |
| Arquitetura & Desacoplamento              | Alta        | <!-- TODO --> |
| Qualidade do Código (TS rigoroso)         | Alta        | <!-- TODO --> |
| Design System                             | Média       | <!-- TODO --> |
| UX & Estados                              | Média       | <!-- TODO --> |
| Testes                                    | Média       | <!-- TODO --> |
| Uso de IA (transparência + senso crítico) | Diferencial | <!-- TODO --> |
| README & Commits                          | Baixa       | <!-- TODO --> |
