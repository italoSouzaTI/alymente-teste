import { create } from 'axios';

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_BASE_URL is not set');
}
export const httpClient = create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
  timeout: 10_000,
});
