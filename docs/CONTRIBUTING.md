# Guia de Contribuição — Padrões de Código e Commits

Este documento explica o fluxo que garante que todo código e commit subam dentro dos padrões do projeto. Ele é o guardião automatizado da qualidade — não é opcional.

---

## Visão geral do fluxo

```
Editar arquivo
     │
     ▼
ESLint no editor  ──► erro em tempo real (sublinhado vermelho)
     │
     ▼
git add
     │
     ▼
git commit -m "tipo(escopo): descrição"
     │
     ├─► pre-commit hook
     │       ├─ lint-staged: ESLint --fix nos arquivos staged
     │       ├─ lint-staged: Prettier --write nos arquivos staged
     │       └─ tsc --noEmit (typecheck do projeto inteiro)
     │           │
     │           └─ FALHA → commit bloqueado + mensagem explicando o problema
     │
     └─► commit-msg hook
             └─ commitlint: valida formato da mensagem
                 │
                 └─ FALHA → commit bloqueado + exemplo do formato correto

Commit aceito ✓
```

---

## Regras do ESLint por camada

O ESLint está configurado para **refletir a Clean Architecture** do projeto. Cada camada tem regras específicas de importação.

### Globais (qualquer arquivo em `src/`)

| Regra                                        | Nível     | O que significa                                                 |
| -------------------------------------------- | --------- | --------------------------------------------------------------- |
| `@typescript-eslint/no-explicit-any`         | **error** | Sem `any` solto. Use o tipo correto ou `unknown` com narrowing. |
| `@typescript-eslint/consistent-type-imports` | **error** | Importe tipos com `import type { Foo }`, não `import { Foo }`.  |
| `@typescript-eslint/no-unused-vars`          | **error** | Variáveis não usadas (prefixe com `_` para ignorar).            |
| `prettier/prettier`                          | **error** | O código deve estar formatado com Prettier antes de commitar.   |
| `no-console`                                 | **warn**  | `console.log` em produção → use `console.warn`/`console.error`. |

### `src/domain/` — zero dependências externas

O domínio é o núcleo do sistema. Deve rodar em **Node puro**, sem React Native, sem HTTP, sem storage.

| Proibido                          | Motivo                                  | Onde colocar                                           |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------ |
| `react`, `react-native`           | UI não pertence ao domínio              | `src/presentation/`                                    |
| `expo-*`                          | Runtime do Expo não pertence ao domínio | `src/infrastructure/`                                  |
| `axios`                           | HTTP é detalhe de infra                 | `src/infrastructure/http/`                             |
| `@tanstack/react-query`           | Cache/UI pertence a presentation/hooks  | `src/presentation/hooks/`                              |
| `AsyncStorage` / `MMKV`           | Persistência é detalhe de infra         | `src/infrastructure/`                                  |
| imports de `**/application/**`    | Dependência na direção errada           | Inverta: crie interface no domain, implemente no infra |
| imports de `**/presentation/**`   | Dependência na direção errada           | Idem                                                   |
| imports de `**/infrastructure/**` | Dependência na direção errada           | Idem                                                   |

**Exemplo de erro e correção:**

```typescript
// ❌ ERRADO — src/domain/entities/Repo.ts
import axios from 'axios';
// ESLint: ❌ [domain/] Não importe "axios" aqui. O domínio define contratos...

// ✅ CERTO — src/domain/entities/Repo.ts
export interface Repo {
  id: number;
  fullName: string;
  stars: number;
  // ...
}
```

### `src/application/` — sem UI, sem infra direta

Use cases orquestram o domínio. Recebem repositórios via injeção de dependência.

| Proibido                                       | Motivo                               | Onde colocar                            |
| ---------------------------------------------- | ------------------------------------ | --------------------------------------- |
| `react-native`, `expo-*`                       | Use cases não têm UI                 | `src/presentation/`                     |
| `axios`                                        | Use cases não fazem HTTP direto      | Receba via interface do domínio         |
| `@tanstack/react-query`                        | Cache é responsabilidade dos hooks   | `src/presentation/hooks/`               |
| imports de `**/presentation/**`                | Dependência na direção errada        | Inverta: presentation chama application |
| imports de `**/infrastructure/repositories/**` | Use case não instancia impl concreta | Receba via parâmetro (injeção)          |

**Exemplo de erro e correção:**

```typescript
// ❌ ERRADO — src/application/use-cases/SearchReposUseCase.ts
import { GitHubRepositoryImpl } from '../../infrastructure/repositories/GitHubRepositoryImpl';
// ESLint: ❌ [application/] Não importe de src/infrastructure/repositories/...

// ✅ CERTO — recebe a interface do domínio via construtor
import type { IGitHubRepository } from '../../domain/repositories/IGitHubRepository';

export class SearchReposUseCase {
  constructor(private readonly repo: IGitHubRepository) {}
  // ...
}
```

### `src/presentation/` — sem chamadas diretas de infra

Telas e hooks de UI consomem use cases — nunca HTTP ou storage diretamente.

| Proibido                                       | Motivo                           | Onde colocar                                             |
| ---------------------------------------------- | -------------------------------- | -------------------------------------------------------- |
| `axios`                                        | Telas não fazem HTTP             | `src/infrastructure/http/`, acessado via use case → hook |
| `AsyncStorage`                                 | Telas não acessam storage        | `src/infrastructure/`, via repositório                   |
| imports de `**/infrastructure/repositories/**` | Presentation não instancia impls | Use `src/infrastructure/di/`                             |
| imports de `**/infrastructure/http/**`         | Idem                             | Idem                                                     |

### `src/presentation/screens/` — apenas Design System

| Proibido                                 | Nível    | Alternativa                                                |
| ---------------------------------------- | -------- | ---------------------------------------------------------- |
| `<Text>` do react-native (especificador) | **warn** | `<Text>` do Design System (`src/presentation/components/`) |
| `<View>` do react-native (especificador) | **warn** | `<Surface>` / `<Card>` do Design System                    |

---

## Como rodar manualmente

```bash
# Verificar todos os erros
yarn lint

# Corrigir automaticamente o que for possível
yarn lint:fix

# Formatar todos os arquivos
yarn format

# Verificar se há arquivos fora do formato (usado no CI)
yarn format:check

# Checar tipos do TypeScript
yarn typecheck

# Rodar testes
yarn test

# Cobertura de testes
yarn test:coverage
```

---

## Conventional Commits

Toda mensagem de commit deve seguir o formato:

```
tipo(escopo opcional): descrição curta em minúsculas

corpo opcional — por que essa mudança foi necessária?

rodapé opcional — BREAKING CHANGE: ... ou Closes #123
```

### Tipos válidos

| Tipo       | Quando usar                                       | Exemplo                                                |
| ---------- | ------------------------------------------------- | ------------------------------------------------------ |
| `feat`     | Nova funcionalidade                               | `feat(search): add infinite scroll`                    |
| `fix`      | Correção de bug                                   | `fix(api): handle 403 rate limit error`                |
| `docs`     | Só documentação                                   | `docs(readme): add installation steps`                 |
| `style`    | Formatação, espaços, ponto-e-vírgula (sem lógica) | `style: run prettier on all files`                     |
| `refactor` | Refatoração sem nova feature ou bugfix            | `refactor(domain): extract Issue entity`               |
| `perf`     | Melhoria de performance                           | `perf(cache): increase staleTime to 10min`             |
| `test`     | Adição ou correção de testes                      | `test(use-cases): cover SearchReposUseCase error path` |
| `build`    | Mudanças no build ou dependências                 | `build(deps): add eslint-config-expo`                  |
| `ci`       | Configuração de CI                                | `ci: add github actions workflow`                      |
| `chore`    | Tarefas que não afetam src/ ou test/              | `chore: update .gitignore`                             |
| `revert`   | Reverter commit anterior                          | `revert: revert feat(search): add infinite scroll`     |

### Escopo (opcional mas recomendado)

Use o nome da camada ou módulo afetado:

```
feat(domain): add Issue entity
fix(github-api): retry on 503 timeout
refactor(design-system): extract Badge token variants
test(application): cover GetRepoDetailsUseCase
chore(husky): configure pre-commit hook
```

### Exemplos de commits ✅ válidos

```bash
git commit -m "feat(search): add debounced input to reduce API calls"
git commit -m "fix(api): return RateLimitError when GitHub returns 403"
git commit -m "refactor(domain): split Repo and Owner into separate entities"
git commit -m "test(use-cases): add SearchReposUseCase empty query test"
git commit -m "docs(contributing): add conventional commits guide"
git commit -m "chore(deps): add husky and commitlint"
```

### Exemplos de commits ❌ rejeitados

```bash
git commit -m "fix stuff"           # tipo inválido ou ausente
git commit -m "WIP"                  # tipo ausente
git commit -m "feat: "               # subject vazio
git commit -m "feat(api): add thing." # subject termina com ponto
```

---

## Quando o commit falha

### Falha no `pre-commit` (lint ou typecheck)

O terminal mostrará o arquivo e a linha com o problema:

```
src/domain/entities/Repo.ts
  3:1  error  ❌ [domain/] Não importe "axios" aqui...  no-restricted-imports

✖ 1 problem (1 error, 0 warnings)
```

**O que fazer:**

1. Abra o arquivo indicado na linha indicada.
2. Leia a mensagem — ela explica o que está errado e onde o código deveria estar.
3. Corrija, faça `git add` novamente e tente o commit.

Para ver todos os erros antes de tentar commitar: `yarn lint`.

### Falha no `commit-msg` (commitlint)

```
⧗   input: fix stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings

ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```

**O que fazer:** Reescreva a mensagem no formato `tipo(escopo): descrição`.

---

## Por que NÃO usar `--no-verify`

```bash
# NUNCA faça isso em código que vai para o repositório
git commit --no-verify -m "..."
```

O flag `--no-verify` bypassa os hooks e permite commitar código que:

- Viola as fronteiras de Clean Architecture.
- Tem `any` solto que vai quebrar o TypeScript em runtime.
- Tem mensagem de commit que impossibilita geração de changelog.
- Está mal formatado, criando diffs de formatação nos PRs.

**Use apenas localmente em WIP** se precisar salvar progresso sem commitar código finalizado (prefira `git stash` ou um branch de rascunho).

---

## Configuração do editor (VS Code)

O projeto inclui `.vscode/settings.json` com a configuração do ESLint para flat config. Se o sublinhado vermelho não aparecer:

1. Instale a extensão **ESLint** (`dbaeumer.vscode-eslint`).
2. Instale a extensão **Prettier - Code formatter** (`esbenp.prettier-vscode`).
3. Reinicie o VS Code.
4. Verifique que `eslint.useFlatConfig` está `true` em `.vscode/settings.json`.
