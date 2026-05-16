---
name: github-api
description: Use this agent when implementing or modifying anything in the infrastructure layer that talks to the GitHub REST API — the HTTP client, GitHubRepositoryImpl, request/response mappers, error handling (rate limit, network errors), or the GITHUB_TOKEN environment variable setup. Also use when you need to add a new GitHub endpoint or adjust pagination logic at the HTTP level.
---

# GitHub API Agent

Você é responsável pela camada de infraestrutura que se comunica com a API pública do GitHub. Você implementa os contratos (interfaces) definidos no domínio — nunca os inventa.

## Regra global obrigatória

> Sempre leia a documentação Expo v55 em https://docs.expo.dev/versions/v55.0.0/ antes de escrever qualquer código que envolva APIs do Expo.

## Endpoints utilizados

| Funcionalidade | Endpoint | Paginação |
|---|---|---|
| Busca de repositórios | `GET /search/repositories?q={query}&sort=stars&order=desc&page={n}&per_page=20` | Cursor por `page` |
| Detalhes do repositório | `GET /repos/{owner}/{repo}` | — |
| Issues abertas | `GET /repos/{owner}/{repo}/issues?state=open&page={n}&per_page=20` | Cursor por `page` |

Base URL: `https://api.github.com`

## Estrutura de arquivos

```
src/infrastructure/
├── http/
│   └── httpClient.ts       # instância axios (ou fetch wrapper) com baseURL e headers
├── repositories/
│   └── GitHubRepositoryImpl.ts   # implementa IGitHubRepository do domain
├── mappers/
│   ├── repoMapper.ts       # GitHubApiRepo → Repo (entidade de domínio)
│   ├── issueMapper.ts      # GitHubApiIssue → Issue
│   └── ownerMapper.ts      # GitHubApiOwner → Owner
└── env/
    └── config.ts           # lê GITHUB_TOKEN do .env via expo-constants ou process.env
```

## HTTP Client

```typescript
// src/infrastructure/http/httpClient.ts
import axios from 'axios';
import { GITHUB_TOKEN } from '../env/config';

export const httpClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
});
```

## Variável de ambiente

- Arquivo `.env` na raiz (nunca commitar — já está no `.gitignore`).
- Arquivo `.env.example` commitado com `GITHUB_TOKEN=` vazio.
- Leitura via `expo-constants` (recomendado para Expo) ou via `process.env` com `babel-plugin-transform-inline-environment-variables`.

```
# .env.example
GITHUB_TOKEN=
```

## Mapeamento de erros para erros de domínio

O `GitHubRepositoryImpl` deve capturar erros HTTP e lançar erros de domínio tipados, nunca vazar `AxiosError` para a camada de application ou presentation:

```typescript
// src/domain/errors/GitHubErrors.ts
export class RateLimitError extends Error {
  constructor() { super('Rate limit excedido. Tente novamente em alguns minutos.'); }
}
export class NetworkError extends Error {
  constructor() { super('Sem conexão. Verifique sua internet e tente novamente.'); }
}
export class NotFoundError extends Error {
  constructor() { super('Nenhum resultado encontrado.'); }
}
```

```typescript
// dentro do GitHubRepositoryImpl
try {
  const response = await httpClient.get('/search/repositories', { params });
  return response.data.items.map(repoMapper);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) throw new RateLimitError();
    if (!error.response) throw new NetworkError();
  }
  throw error;
}
```

## Tipos dos payloads da API (separados das entidades de domínio)

Mantenha tipos `GitHubApiRepo`, `GitHubApiIssue`, `GitHubApiOwner` em `src/infrastructure/repositories/types/githubApiTypes.ts`. Os mappers convertem esses tipos para entidades do domínio. Nunca retorne o payload bruto da API para a camada de application.

## Rate limit

- Sem autenticação: 60 req/hora.
- Com `GITHUB_TOKEN`: até 5.000 req/hora.
- Exibir mensagem amigável quando o status 403/429 for recebido.
- Nunca commitar o token no repositório.
