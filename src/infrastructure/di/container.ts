import { GitHubRepositoryImpl } from '@infrastructure/repositories/GitHubRepositoryImpl';
import { SearchReposUseCase } from '@application/use-cases/SearchReposUseCase';
import { GetRepoDetailsUseCase } from '@application/use-cases/GetRepoDetailsUseCase';
import { GetRepoIssuesUseCase } from '@application/use-cases/GetRepoIssuesUseCase';

// Singleton do repositório — compartilhado entre todos os use cases
const gitHubRepository = new GitHubRepositoryImpl();

// Use cases — injetados com a implementação concreta do repositório
export const searchReposUseCase = new SearchReposUseCase(gitHubRepository);
export const getRepoDetailsUseCase = new GetRepoDetailsUseCase(gitHubRepository);
export const getRepoIssuesUseCase = new GetRepoIssuesUseCase(gitHubRepository);
