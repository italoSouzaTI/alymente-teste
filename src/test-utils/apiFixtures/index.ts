import type {
  GitHubApiOwner,
  GitHubApiRepo,
  GitHubApiLabel,
  GitHubApiIssue,
  GitHubSearchResponse,
} from '@infrastructure/repositories/types/githubApiTypes';

export function makeApiOwner(overrides: Partial<GitHubApiOwner> = {}): GitHubApiOwner {
  return {
    id: 1,
    login: 'owner',
    avatar_url: 'https://example.com/avatar.png',
    html_url: 'https://github.com/owner',
    ...overrides,
  };
}

export function makeApiRepo(overrides: Partial<GitHubApiRepo> = {}): GitHubApiRepo {
  return {
    id: 1,
    name: 'repo',
    full_name: 'owner/repo',
    owner: makeApiOwner(),
    description: 'A test repository',
    stargazers_count: 100,
    forks_count: 10,
    watchers_count: 5,
    language: 'TypeScript',
    html_url: 'https://github.com/owner/repo',
    open_issues_count: 3,
    ...overrides,
  };
}

export function makeApiLabel(overrides: Partial<GitHubApiLabel> = {}): GitHubApiLabel {
  return {
    id: 1,
    name: 'bug',
    color: 'ee0701',
    description: 'Something is not working',
    ...overrides,
  };
}

export function makeApiIssue(overrides: Partial<GitHubApiIssue> = {}): GitHubApiIssue {
  return {
    id: 1,
    number: 1,
    title: 'Test issue',
    state: 'open',
    user: makeApiOwner(),
    labels: [],
    created_at: '2024-01-01T00:00:00Z',
    html_url: 'https://github.com/owner/repo/issues/1',
    ...overrides,
  };
}

export function makeSearchResponse(
  items: GitHubApiRepo[],
  totalCount = items.length,
): GitHubSearchResponse {
  return {
    total_count: totalCount,
    incomplete_results: false,
    items,
  };
}
