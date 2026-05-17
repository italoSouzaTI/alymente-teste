import { act } from '@testing-library/react-native';
import { useRepoDetailViewModel } from '@viewmodels/useRepoDetailViewModel';
import { renderHookWithProviders } from '../../../test-utils/renderWithProviders';
import { makeRepo } from '../../../test-utils/fixtures';
import { NetworkError } from '@domain/errors/GitHubErrors';

jest.mock('@infrastructure/di/container', () => ({
  searchReposUseCase: { execute: jest.fn() },
  getRepoDetailsUseCase: { execute: jest.fn() },
  getRepoIssuesUseCase: { execute: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getRepoDetailsUseCase } = require('@infrastructure/di/container') as {
  getRepoDetailsUseCase: { execute: jest.Mock };
};

describe('useRepoDetailViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    getRepoDetailsUseCase.execute.mockResolvedValue(makeRepo());

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'));
    const [state] = result.current;

    expect(state.repo).toBeNull();
    expect(state.error).toBeNull();
  });

  it('sets repo after successful execute', async () => {
    const repo = makeRepo({ fullName: 'facebook/react' });
    getRepoDetailsUseCase.execute.mockResolvedValue(repo);

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.repo?.fullName).toBe('facebook/react');
  });

  it('calls execute with correct params', async () => {
    getRepoDetailsUseCase.execute.mockResolvedValue(makeRepo());

    renderHookWithProviders(() => useRepoDetailViewModel('torvalds', 'linux'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(getRepoDetailsUseCase.execute).toHaveBeenCalledWith({
      owner: 'torvalds',
      repo: 'linux',
    });
  });

  it('sets error message on rejected execute', async () => {
    getRepoDetailsUseCase.execute.mockRejectedValue(new NetworkError());

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.error).toBeTruthy();
  });

  it('does not fetch when owner or repo is empty', () => {
    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('', ''));
    const [state] = result.current;

    expect(state.repo).toBeNull();
    expect(getRepoDetailsUseCase.execute).not.toHaveBeenCalled();
  });

  it('exposes retry action', async () => {
    getRepoDetailsUseCase.execute.mockResolvedValue(makeRepo());

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'));

    await act(async () => {
      result.current[1].retry();
    });

    expect(getRepoDetailsUseCase.execute).toHaveBeenCalled();
  });
});
