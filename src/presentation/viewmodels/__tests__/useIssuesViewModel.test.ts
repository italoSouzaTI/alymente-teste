import { act } from '@testing-library/react-native';
import { useIssuesViewModel } from '@viewmodels/useIssuesViewModel';
import { renderHookWithProviders } from '../../../test-utils/renderWithProviders';
import { makeIssue, makePaginated } from '../../../test-utils/fixtures';
import { RateLimitError } from '@domain/errors/GitHubErrors';

jest.mock('@infrastructure/di/container', () => ({
  searchReposUseCase: { execute: jest.fn() },
  getRepoDetailsUseCase: { execute: jest.fn() },
  getRepoIssuesUseCase: { execute: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getRepoIssuesUseCase } = require('@infrastructure/di/container') as {
  getRepoIssuesUseCase: { execute: jest.Mock };
};

describe('useIssuesViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    getRepoIssuesUseCase.execute.mockResolvedValue(makePaginated([]));

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'));
    const [state] = result.current;

    expect(state.issues).toHaveLength(0);
    expect(state.error).toBeNull();
    expect(state.hasNextPage).toBe(false);
  });

  it('populates issues after successful execute', async () => {
    const issues = [makeIssue({ title: 'Fix memory leak', number: 100 })];
    getRepoIssuesUseCase.execute.mockResolvedValue(makePaginated(issues));

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.issues).toHaveLength(1);
    expect(state.issues[0].title).toBe('Fix memory leak');
  });

  it('calls execute with correct params', async () => {
    getRepoIssuesUseCase.execute.mockResolvedValue(makePaginated([]));

    renderHookWithProviders(() => useIssuesViewModel('torvalds', 'linux'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(getRepoIssuesUseCase.execute).toHaveBeenCalledWith({
      owner: 'torvalds',
      repo: 'linux',
      page: 1,
    });
  });

  it('sets error message on RateLimitError', async () => {
    getRepoIssuesUseCase.execute.mockRejectedValue(new RateLimitError());

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.error).toBeTruthy();
  });

  it('does not fetch when owner or repo is empty', () => {
    const { result } = renderHookWithProviders(() => useIssuesViewModel('', ''));
    const [state] = result.current;

    expect(state.issues).toHaveLength(0);
    expect(getRepoIssuesUseCase.execute).not.toHaveBeenCalled();
  });

  it('sets hasNextPage correctly', async () => {
    getRepoIssuesUseCase.execute.mockResolvedValue(makePaginated([makeIssue()], true));

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.hasNextPage).toBe(true);
  });
});
