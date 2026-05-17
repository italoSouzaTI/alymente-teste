import type { Repo } from '../entities/Repo';
import type { Issue } from '../entities/Issue';

export interface PaginatedResult<T> {
  items: T[];
  hasNextPage: boolean;
  totalCount?: number;
}

export interface IGitHubRepository {
  searchRepos(query: string, page: number): Promise<PaginatedResult<Repo>>;
  getRepoDetails(owner: string, repo: string): Promise<Repo>;
  getRepoIssues(owner: string, repo: string, page: number): Promise<PaginatedResult<Issue>>;
}
