export interface GitHubApiOwner {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubApiOwner;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  html_url: string;
  open_issues_count: number;
}

export interface GitHubApiLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface GitHubApiIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  user: GitHubApiOwner;
  labels: GitHubApiLabel[];
  created_at: string;
  html_url: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubApiRepo[];
}
