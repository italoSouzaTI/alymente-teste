import { mapIssue } from '@infrastructure/mappers/issueMapper';
import { makeApiIssue, makeApiLabel, makeApiOwner } from '../../test-utils/apiFixtures';

describe('issueMapper', () => {
  describe('mapIssue', () => {
    it('maps all basic fields correctly', () => {
      const apiIssue = makeApiIssue({
        id: 42,
        number: 7,
        title: 'Fix memory leak',
        state: 'open',
        html_url: 'https://github.com/owner/repo/issues/7',
      });

      const result = mapIssue(apiIssue);

      expect(result.id).toBe(42);
      expect(result.number).toBe(7);
      expect(result.title).toBe('Fix memory leak');
      expect(result.state).toBe('open');
      expect(result.htmlUrl).toBe('https://github.com/owner/repo/issues/7');
    });

    it('parses created_at string into a Date object', () => {
      const apiIssue = makeApiIssue({ created_at: '2024-06-15T12:00:00Z' });

      const result = mapIssue(apiIssue);

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe('2024-06-15T12:00:00.000Z');
    });

    it('maps state "closed" correctly', () => {
      const apiIssue = makeApiIssue({ state: 'closed' });

      const result = mapIssue(apiIssue);

      expect(result.state).toBe('closed');
    });

    it('maps unknown state as "closed"', () => {
      const apiIssue = makeApiIssue({ state: 'unknown_state' });

      const result = mapIssue(apiIssue);

      expect(result.state).toBe('closed');
    });

    it('maps labels array correctly', () => {
      const label1 = makeApiLabel({ id: 1, name: 'bug', color: 'ee0701', description: 'Bug' });
      const label2 = makeApiLabel({
        id: 2,
        name: 'enhancement',
        color: '84b6eb',
        description: null,
      });
      const apiIssue = makeApiIssue({ labels: [label1, label2] });

      const result = mapIssue(apiIssue);

      expect(result.labels).toHaveLength(2);
      expect(result.labels[0]).toEqual({ id: 1, name: 'bug', color: 'ee0701', description: 'Bug' });
      expect(result.labels[1]).toEqual({
        id: 2,
        name: 'enhancement',
        color: '84b6eb',
        description: null,
      });
    });

    it('maps empty labels array', () => {
      const apiIssue = makeApiIssue({ labels: [] });

      const result = mapIssue(apiIssue);

      expect(result.labels).toHaveLength(0);
    });

    it('maps author via mapOwner', () => {
      const apiIssue = makeApiIssue({ user: makeApiOwner({ login: 'contributor' }) });

      const result = mapIssue(apiIssue);

      expect(result.author.login).toBe('contributor');
    });
  });
});
