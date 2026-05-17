import { GetRepoDetailsUseCase } from '@application/use-cases/GetRepoDetailsUseCase';
import { FakeGitHubRepository } from '../../../test-utils/fakeRepository';
import { makeRepo } from '../../../test-utils/fixtures';
import { NotFoundError, NetworkError } from '@domain/errors/GitHubErrors';

describe('GetRepoDetailsUseCase', () => {
  let fakeRepo: FakeGitHubRepository;
  let useCase: GetRepoDetailsUseCase;

  beforeEach(() => {
    fakeRepo = new FakeGitHubRepository();
    useCase = new GetRepoDetailsUseCase(fakeRepo);
  });

  it('delegates to repo with correct owner and repo params', async () => {
    const expectedRepo = makeRepo({ fullName: 'facebook/react' });
    fakeRepo.getRepoDetails.mockResolvedValue(expectedRepo);

    const result = await useCase.execute({ owner: 'facebook', repo: 'react' });

    expect(fakeRepo.getRepoDetails).toHaveBeenCalledWith('facebook', 'react');
    expect(result.fullName).toBe('facebook/react');
  });

  it('returns repo data from repository', async () => {
    const expectedRepo = makeRepo({ stars: 200000, language: 'JavaScript' });
    fakeRepo.getRepoDetails.mockResolvedValue(expectedRepo);

    const result = await useCase.execute({ owner: 'owner', repo: 'repo' });

    expect(result.stars).toBe(200000);
    expect(result.language).toBe('JavaScript');
  });

  it('propagates NotFoundError from repo', async () => {
    fakeRepo.getRepoDetails.mockRejectedValue(new NotFoundError());

    await expect(useCase.execute({ owner: 'owner', repo: 'nonexistent' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('propagates NetworkError from repo', async () => {
    fakeRepo.getRepoDetails.mockRejectedValue(new NetworkError());

    await expect(useCase.execute({ owner: 'owner', repo: 'repo' })).rejects.toBeInstanceOf(
      NetworkError,
    );
  });
});
