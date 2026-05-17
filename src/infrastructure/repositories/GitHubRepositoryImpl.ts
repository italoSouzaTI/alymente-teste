import { isAxiosError } from 'axios';
import type {
  IGitHubRepository,
  PaginatedResult,
} from '../../domain/repositories/IGitHubRepository';
import type { Repo } from '../../domain/entities/Repo';
import type { Issue } from '../../domain/entities/Issue';
import { RateLimitError, NetworkError, UnknownApiError } from '../../domain/errors/GitHubErrors';
import { httpClient } from '../http/httpClient';
import { mapRepo } from '../mappers/repoMapper';
import { mapIssue } from '../mappers/issueMapper';
import type { GitHubSearchResponse, GitHubApiRepo, GitHubApiIssue } from './types/githubApiTypes';

const PER_PAGE = 20;

function handleAxiosError(error: unknown): never {
  if (isAxiosError(error)) {
    if (!error.response) throw new NetworkError();
    if (error.response.status === 403 || error.response.status === 429) throw new RateLimitError();
    throw new UnknownApiError(error.response.status);
  }
  throw error;
}

export class GitHubRepositoryImpl implements IGitHubRepository {
  async searchRepos(query: string, page: number): Promise<PaginatedResult<Repo>> {
    try {
      const { data } = await httpClient.get<GitHubSearchResponse>('/search/repositories', {
        params: { q: query, sort: 'stars', order: 'desc', page, per_page: PER_PAGE },
      });
      return {
        items: data.items.map(mapRepo),
        hasNextPage: data.items.length === PER_PAGE,
        totalCount: data.total_count,
      };
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getRepoDetails(owner: string, repo: string): Promise<Repo> {
    try {
      const { data } = await httpClient.get<GitHubApiRepo>(`/repos/${owner}/${repo}`);
      return mapRepo(data);
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getRepoIssues(owner: string, repo: string, page: number): Promise<PaginatedResult<Issue>> {
    try {
      const { data } = await httpClient.get<GitHubApiIssue[]>(`/repos/${owner}/${repo}/issues`, {
        params: { state: 'open', page, per_page: PER_PAGE },
      });
      return {
        items: data.map(mapIssue),
        hasNextPage: data.length === PER_PAGE,
      };
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
