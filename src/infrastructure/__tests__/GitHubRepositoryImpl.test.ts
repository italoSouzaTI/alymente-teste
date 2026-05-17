import MockAdapter from 'axios-mock-adapter';
import { httpClient } from '@infrastructure/http/httpClient';
import { GitHubRepositoryImpl } from '@infrastructure/repositories/GitHubRepositoryImpl';
import { RateLimitError, NetworkError, UnknownApiError } from '@domain/errors/GitHubErrors';
import { makeApiRepo, makeApiIssue, makeSearchResponse } from '../../test-utils/apiFixtures';

describe('GitHubRepositoryImpl', () => {
  let mock: MockAdapter;
  let repository: GitHubRepositoryImpl;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    repository = new GitHubRepositoryImpl();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('searchRepos', () => {
    it('calls correct URL and params', async () => {
      const response = makeSearchResponse([makeApiRepo()], 1);
      mock.onGet('/search/repositories').reply(200, response);

      await repository.searchRepos('react', 1);

      expect(mock.history.get[0].url).toBe('/search/repositories');
      expect(mock.history.get[0].params).toMatchObject({
        q: 'react',
        page: 1,
        sort: 'stars',
        order: 'desc',
      });
    });

    it('maps response items correctly', async () => {
      const apiRepo = makeApiRepo({ full_name: 'facebook/react', stargazers_count: 200000 });
      const response = makeSearchResponse([apiRepo], 1);
      mock.onGet('/search/repositories').reply(200, response);

      const result = await repository.searchRepos('react', 1);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].fullName).toBe('facebook/react');
      expect(result.items[0].stars).toBe(200000);
    });

    it('sets hasNextPage=true when items count equals PER_PAGE (20)', async () => {
      const items = Array.from({ length: 20 }, (_, i) =>
        makeApiRepo({ id: i + 1, name: `repo-${i}`, full_name: `owner/repo-${i}` }),
      );
      mock.onGet('/search/repositories').reply(200, makeSearchResponse(items, 100));

      const result = await repository.searchRepos('react', 1);

      expect(result.hasNextPage).toBe(true);
    });

    it('sets hasNextPage=false when items count is less than 20', async () => {
      const items = [makeApiRepo()];
      mock.onGet('/search/repositories').reply(200, makeSearchResponse(items, 1));

      const result = await repository.searchRepos('react', 1);

      expect(result.hasNextPage).toBe(false);
    });

    it('sets totalCount from response', async () => {
      mock.onGet('/search/repositories').reply(200, makeSearchResponse([makeApiRepo()], 42));

      const result = await repository.searchRepos('react', 1);

      expect(result.totalCount).toBe(42);
    });

    it('throws RateLimitError on 403', async () => {
      mock.onGet('/search/repositories').reply(403);

      await expect(repository.searchRepos('react', 1)).rejects.toBeInstanceOf(RateLimitError);
    });

    it('throws RateLimitError on 429', async () => {
      mock.onGet('/search/repositories').reply(429);

      await expect(repository.searchRepos('react', 1)).rejects.toBeInstanceOf(RateLimitError);
    });

    it('throws NetworkError on network failure', async () => {
      mock.onGet('/search/repositories').networkError();

      await expect(repository.searchRepos('react', 1)).rejects.toBeInstanceOf(NetworkError);
    });

    it('throws UnknownApiError on unexpected status', async () => {
      mock.onGet('/search/repositories').reply(500);

      await expect(repository.searchRepos('react', 1)).rejects.toBeInstanceOf(UnknownApiError);
    });
  });

  describe('getRepoDetails', () => {
    it('calls correct URL', async () => {
      mock.onGet('/repos/facebook/react').reply(200, makeApiRepo());

      await repository.getRepoDetails('facebook', 'react');

      expect(mock.history.get[0].url).toBe('/repos/facebook/react');
    });

    it('maps response correctly', async () => {
      const apiRepo = makeApiRepo({ full_name: 'facebook/react', forks_count: 55000 });
      mock.onGet('/repos/facebook/react').reply(200, apiRepo);

      const result = await repository.getRepoDetails('facebook', 'react');

      expect(result.fullName).toBe('facebook/react');
      expect(result.forks).toBe(55000);
    });

    it('throws UnknownApiError on 404 (not mapped to NotFoundError in impl)', async () => {
      mock.onGet('/repos/owner/nonexistent').reply(404);

      await expect(repository.getRepoDetails('owner', 'nonexistent')).rejects.toBeInstanceOf(
        UnknownApiError,
      );
    });

    it('throws NetworkError on network failure', async () => {
      mock.onGet('/repos/owner/repo').networkError();

      await expect(repository.getRepoDetails('owner', 'repo')).rejects.toBeInstanceOf(NetworkError);
    });
  });

  describe('getRepoIssues', () => {
    it('calls correct URL', async () => {
      mock.onGet('/repos/facebook/react/issues').reply(200, []);

      await repository.getRepoIssues('facebook', 'react', 1);

      expect(mock.history.get[0].url).toBe('/repos/facebook/react/issues');
    });

    it('includes correct params', async () => {
      mock.onGet('/repos/facebook/react/issues').reply(200, []);

      await repository.getRepoIssues('facebook', 'react', 2);

      expect(mock.history.get[0].params).toMatchObject({ state: 'open', page: 2 });
    });

    it('maps issues correctly', async () => {
      const apiIssue = makeApiIssue({ title: 'Fix bug', number: 42 });
      mock.onGet('/repos/facebook/react/issues').reply(200, [apiIssue]);

      const result = await repository.getRepoIssues('facebook', 'react', 1);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Fix bug');
      expect(result.items[0].number).toBe(42);
    });

    it('throws RateLimitError on 403', async () => {
      mock.onGet('/repos/owner/repo/issues').reply(403);

      await expect(repository.getRepoIssues('owner', 'repo', 1)).rejects.toBeInstanceOf(
        RateLimitError,
      );
    });

    it('throws NetworkError on network failure', async () => {
      mock.onGet('/repos/owner/repo/issues').networkError();

      await expect(repository.getRepoIssues('owner', 'repo', 1)).rejects.toBeInstanceOf(
        NetworkError,
      );
    });
  });
});
