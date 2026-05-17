import { mapOwner, mapRepo } from '@infrastructure/mappers/repoMapper';
import { makeApiOwner, makeApiRepo } from '../../test-utils/apiFixtures';

describe('repoMapper', () => {
  describe('mapOwner', () => {
    it('maps all fields correctly', () => {
      const apiOwner = makeApiOwner({
        id: 42,
        login: 'torvalds',
        avatar_url: 'https://avatars.example.com/u/42',
        html_url: 'https://github.com/torvalds',
      });

      const result = mapOwner(apiOwner);

      expect(result).toEqual({
        id: 42,
        login: 'torvalds',
        avatarUrl: 'https://avatars.example.com/u/42',
        htmlUrl: 'https://github.com/torvalds',
      });
    });

    it('maps snake_case to camelCase correctly', () => {
      const apiOwner = makeApiOwner();

      const result = mapOwner(apiOwner);

      expect(result.avatarUrl).toBe(apiOwner.avatar_url);
      expect(result.htmlUrl).toBe(apiOwner.html_url);
    });
  });

  describe('mapRepo', () => {
    it('maps all required fields correctly', () => {
      const apiRepo = makeApiRepo({
        id: 1,
        name: 'linux',
        full_name: 'torvalds/linux',
        stargazers_count: 200000,
        forks_count: 50000,
        watchers_count: 200000,
        language: 'C',
        open_issues_count: 100,
      });

      const result = mapRepo(apiRepo);

      expect(result.id).toBe(1);
      expect(result.name).toBe('linux');
      expect(result.fullName).toBe('torvalds/linux');
      expect(result.stars).toBe(200000);
      expect(result.forks).toBe(50000);
      expect(result.watchers).toBe(200000);
      expect(result.language).toBe('C');
      expect(result.openIssuesCount).toBe(100);
    });

    it('maps null description correctly', () => {
      const apiRepo = makeApiRepo({ description: null });

      const result = mapRepo(apiRepo);

      expect(result.description).toBeNull();
    });

    it('maps null language correctly', () => {
      const apiRepo = makeApiRepo({ language: null });

      const result = mapRepo(apiRepo);

      expect(result.language).toBeNull();
    });

    it('maps owner via mapOwner', () => {
      const apiRepo = makeApiRepo({ owner: makeApiOwner({ login: 'torvalds' }) });

      const result = mapRepo(apiRepo);

      expect(result.owner.login).toBe('torvalds');
    });

    it('maps htmlUrl correctly', () => {
      const apiRepo = makeApiRepo({ html_url: 'https://github.com/owner/repo' });

      const result = mapRepo(apiRepo);

      expect(result.htmlUrl).toBe('https://github.com/owner/repo');
    });
  });
});
