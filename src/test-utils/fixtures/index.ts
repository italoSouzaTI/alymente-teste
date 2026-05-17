import type { Owner } from '@domain/entities/Owner';
import type { Repo } from '@domain/entities/Repo';
import type { Label } from '@domain/entities/Label';
import type { Issue } from '@domain/entities/Issue';
import type { PaginatedResult } from '@domain/repositories/IGitHubRepository';

export function makeOwner(overrides: Partial<Owner> = {}): Owner {
  return {
    id: 1,
    login: 'owner',
    avatarUrl: 'https://example.com/avatar.png',
    htmlUrl: 'https://github.com/owner',
    ...overrides,
  };
}

export function makeRepo(overrides: Partial<Repo> = {}): Repo {
  return {
    id: 1,
    name: 'repo',
    fullName: 'owner/repo',
    owner: makeOwner(),
    description: 'A test repository',
    stars: 100,
    forks: 10,
    watchers: 5,
    language: 'TypeScript',
    htmlUrl: 'https://github.com/owner/repo',
    openIssuesCount: 3,
    ...overrides,
  };
}

export function makeLabel(overrides: Partial<Label> = {}): Label {
  return {
    id: 1,
    name: 'bug',
    color: 'ee0701',
    description: 'Something is not working',
    ...overrides,
  };
}

export function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: 1,
    number: 1,
    title: 'Test issue',
    state: 'open',
    author: makeOwner(),
    labels: [],
    createdAt: new Date('2024-01-01T00:00:00Z'),
    htmlUrl: 'https://github.com/owner/repo/issues/1',
    ...overrides,
  };
}

export function makePaginated<T>(items: T[], hasNextPage = false): PaginatedResult<T> {
  return {
    items,
    hasNextPage,
    totalCount: items.length,
  };
}
