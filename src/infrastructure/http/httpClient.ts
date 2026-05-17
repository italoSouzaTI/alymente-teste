import { create } from 'axios';

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

export const httpClient = create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
  timeout: 10_000,
});
