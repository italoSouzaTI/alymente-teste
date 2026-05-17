import { GetRepoIssuesUseCase } from '@application/use-cases/GetRepoIssuesUseCase';
import { FakeGitHubRepository } from '../../../test-utils/fakeRepository';
import { makeIssue, makePaginated } from '../../../test-utils/fixtures';
import { NetworkError, RateLimitError } from '@domain/errors/GitHubErrors';

describe('GetRepoIssuesUseCase', () => {
  let fakeRepo: FakeGitHubRepository;
  let useCase: GetRepoIssuesUseCase;

  beforeEach(() => {
    fakeRepo = new FakeGitHubRepository();
    useCase = new GetRepoIssuesUseCase(fakeRepo);
  });

  it('delegates to repo with correct owner, repo, and page params', async () => {
    const issues = [makeIssue({ title: 'Fix bug' })];
    fakeRepo.getRepoIssues.mockResolvedValue(makePaginated(issues));

    const result = await useCase.execute({ owner: 'facebook', repo: 'react', page: 1 });

    expect(fakeRepo.getRepoIssues).toHaveBeenCalledWith('facebook', 'react', 1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Fix bug');
  });

  it('delegates with correct page number', async () => {
    fakeRepo.getRepoIssues.mockResolvedValue(makePaginated([]));

    await useCase.execute({ owner: 'owner', repo: 'repo', page: 3 });

    expect(fakeRepo.getRepoIssues).toHaveBeenCalledWith('owner', 'repo', 3);
  });

  it('returns hasNextPage from repo response', async () => {
    fakeRepo.getRepoIssues.mockResolvedValue(makePaginated([makeIssue()], true));

    const result = await useCase.execute({ owner: 'owner', repo: 'repo', page: 1 });

    expect(result.hasNextPage).toBe(true);
  });

  it('propagates NetworkError from repo', async () => {
    fakeRepo.getRepoIssues.mockRejectedValue(new NetworkError());

    await expect(useCase.execute({ owner: 'owner', repo: 'repo', page: 1 })).rejects.toBeInstanceOf(
      NetworkError,
    );
  });

  it('propagates RateLimitError from repo', async () => {
    fakeRepo.getRepoIssues.mockRejectedValue(new RateLimitError());

    await expect(useCase.execute({ owner: 'owner', repo: 'repo', page: 1 })).rejects.toBeInstanceOf(
      RateLimitError,
    );
  });
});
