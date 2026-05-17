import type {
  IGitHubRepository,
  PaginatedResult,
} from '../../domain/repositories/IGitHubRepository';
import type { Repo } from '../../domain/entities/Repo';

export interface SearchReposInput {
  query: string;
  page: number;
}

export class SearchReposUseCase {
  constructor(private readonly repository: IGitHubRepository) {}

  async execute(input: SearchReposInput): Promise<PaginatedResult<Repo>> {
    const trimmed = input.query.trim();
    if (!trimmed) {
      return { items: [], hasNextPage: false, totalCount: 0 };
    }
    return this.repository.searchRepos(trimmed, input.page);
  }
}
