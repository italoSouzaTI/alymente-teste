import type { Repo } from '../../domain/entities/Repo';
import type { Owner } from '../../domain/entities/Owner';
import type { GitHubApiRepo, GitHubApiOwner } from '../repositories/types/githubApiTypes';

export function mapOwner(api: GitHubApiOwner): Owner {
  return {
    id: api.id,
    login: api.login,
    avatarUrl: api.avatar_url,
    htmlUrl: api.html_url,
  };
}

export function mapRepo(api: GitHubApiRepo): Repo {
  return {
    id: api.id,
    name: api.name,
    fullName: api.full_name,
    owner: mapOwner(api.owner),
    description: api.description,
    stars: api.stargazers_count,
    forks: api.forks_count,
    watchers: api.watchers_count,
    language: api.language,
    htmlUrl: api.html_url,
    openIssuesCount: api.open_issues_count,
  };
}
