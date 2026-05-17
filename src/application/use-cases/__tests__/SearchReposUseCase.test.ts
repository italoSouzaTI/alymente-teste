import { SearchReposUseCase } from '@application/use-cases/SearchReposUseCase';
import { FakeGitHubRepository } from '../../../test-utils/fakeRepository';
import { makeRepo, makePaginated } from '../../../test-utils/fixtures';
import { RateLimitError, NetworkError } from '@domain/errors/GitHubErrors';

describe('SearchReposUseCase', () => {
  let fakeRepo: FakeGitHubRepository;
  let useCase: SearchReposUseCase;

  beforeEach(() => {
    fakeRepo = new FakeGitHubRepository();
    useCase = new SearchReposUseCase(fakeRepo);
  });

  it('returns empty result without calling repo when query is empty string', async () => {
    const result = await useCase.execute({ query: '', page: 1 });

    expect(result).toEqual({ items: [], hasNextPage: false, totalCount: 0 });
    expect(fakeRepo.searchRepos).not.toHaveBeenCalled();
  });

  it('returns empty result without calling repo when query is whitespace only', async () => {
    const result = await useCase.execute({ query: '   ', page: 1 });

    expect(result).toEqual({ items: [], hasNextPage: false, totalCount: 0 });
    expect(fakeRepo.searchRepos).not.toHaveBeenCalled();
  });

  it('delegates to repo with trimmed query and correct page', async () => {
    const repos = [makeRepo({ fullName: 'facebook/react' })];
    fakeRepo.searchRepos.mockResolvedValue(makePaginated(repos));

    const result = await useCase.execute({ query: '  react  ', page: 2 });

    expect(fakeRepo.searchRepos).toHaveBeenCalledWith('react', 2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].fullName).toBe('facebook/react');
  });

  it('uses page 1 by default behavior when page=1 is passed', async () => {
    fakeRepo.searchRepos.mockResolvedValue(makePaginated([]));

    await useCase.execute({ query: 'react', page: 1 });

    expect(fakeRepo.searchRepos).toHaveBeenCalledWith('react', 1);
  });

  it('propagates RateLimitError from repo', async () => {
    fakeRepo.searchRepos.mockRejectedValue(new RateLimitError());

    await expect(useCase.execute({ query: 'react', page: 1 })).rejects.toBeInstanceOf(
      RateLimitError,
    );
  });

  it('propagates NetworkError from repo', async () => {
    fakeRepo.searchRepos.mockRejectedValue(new NetworkError());

    await expect(useCase.execute({ query: 'react', page: 1 })).rejects.toBeInstanceOf(NetworkError);
  });

  it('returns hasNextPage from repo response', async () => {
    fakeRepo.searchRepos.mockResolvedValue(makePaginated([makeRepo()], true));

    const result = await useCase.execute({ query: 'react', page: 1 });

    expect(result.hasNextPage).toBe(true);
  });
});
