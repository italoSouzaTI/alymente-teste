import type { Owner } from './Owner';

export interface Repo {
  id: number;
  name: string;
  fullName: string;
  owner: Owner;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  htmlUrl: string;
  openIssuesCount: number;
}
