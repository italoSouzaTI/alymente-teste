import type { IGitHubRepository } from '@domain/repositories/IGitHubRepository';

export class FakeGitHubRepository implements IGitHubRepository {
  searchRepos = jest.fn();
  getRepoDetails = jest.fn();
  getRepoIssues = jest.fn();
}
