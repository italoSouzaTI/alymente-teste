import type { Issue } from '../../domain/entities/Issue';
import type { Label } from '../../domain/entities/Label';
import type { GitHubApiIssue, GitHubApiLabel } from '../repositories/types/githubApiTypes';
import { mapOwner } from './repoMapper';

function mapLabel(api: GitHubApiLabel): Label {
  return {
    id: api.id,
    name: api.name,
    color: api.color,
    description: api.description,
  };
}

export function mapIssue(api: GitHubApiIssue): Issue {
  return {
    id: api.id,
    number: api.number,
    title: api.title,
    state: api.state === 'open' ? 'open' : 'closed',
    author: mapOwner(api.user),
    labels: api.labels.map(mapLabel),
    createdAt: new Date(api.created_at),
    htmlUrl: api.html_url,
  };
}
