import type { IGitHubRepository } from '../../domain/repositories/IGitHubRepository';
import type { Repo } from '../../domain/entities/Repo';

export interface GetRepoDetailsInput {
  owner: string;
  repo: string;
}

export class GetRepoDetailsUseCase {
  constructor(private readonly repository: IGitHubRepository) {}

  async execute(input: GetRepoDetailsInput): Promise<Repo> {
    return this.repository.getRepoDetails(input.owner, input.repo);
  }
}
