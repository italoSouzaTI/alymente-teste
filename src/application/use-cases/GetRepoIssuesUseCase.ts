import type { IGitHubRepository, PaginatedResult } from '@domain/repositories/IGitHubRepository';
import type { Issue } from '@domain/entities/Issue';

export interface GetRepoIssuesInput {
  owner: string;
  repo: string;
  page: number;
}

export class GetRepoIssuesUseCase {
  constructor(private readonly repository: IGitHubRepository) {}

  async execute(input: GetRepoIssuesInput): Promise<PaginatedResult<Issue>> {
    return this.repository.getRepoIssues(input.owner, input.repo, input.page);
  }
}
