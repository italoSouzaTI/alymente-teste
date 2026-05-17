import { act } from '@testing-library/react-native';
import { useRepoDetailViewModel } from '@viewmodels/useRepoDetailViewModel';
import { renderHookWithProviders } from '../../../test-utils/renderWithProviders';
import { makeRepo } from '../../../test-utils/fixtures';
import { NetworkError } from '@domain/errors/GitHubErrors';

function makeDetailsUseCase(impl?: jest.Mock) {
  return { execute: impl ?? jest.fn() } as never;
}

describe('useRepoDetailViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'), {
      useCases: {
        getRepoDetailsUseCase: makeDetailsUseCase(jest.fn().mockResolvedValue(makeRepo())),
      },
    });
    const [state] = result.current;

    expect(state.repo).toBeNull();
    expect(state.error).toBeNull();
  });

  it('sets repo after successful execute', async () => {
    const repo = makeRepo({ fullName: 'facebook/react' });
    const execute = jest.fn().mockResolvedValue(repo);

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'), {
      useCases: { getRepoDetailsUseCase: makeDetailsUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.repo?.fullName).toBe('facebook/react');
  });

  it('calls execute with correct params', async () => {
    const execute = jest.fn().mockResolvedValue(makeRepo());

    renderHookWithProviders(() => useRepoDetailViewModel('torvalds', 'linux'), {
      useCases: { getRepoDetailsUseCase: makeDetailsUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(execute).toHaveBeenCalledWith({ owner: 'torvalds', repo: 'linux' });
  });

  it('sets error message on rejected execute', async () => {
    const execute = jest.fn().mockRejectedValue(new NetworkError());

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'), {
      useCases: { getRepoDetailsUseCase: makeDetailsUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.error).toBeTruthy();
  });

  it('does not fetch when owner or repo is empty', () => {
    const execute = jest.fn();

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('', ''), {
      useCases: { getRepoDetailsUseCase: makeDetailsUseCase(execute) },
    });
    const [state] = result.current;

    expect(state.repo).toBeNull();
    expect(execute).not.toHaveBeenCalled();
  });

  it('exposes retry action', async () => {
    const execute = jest.fn().mockResolvedValue(makeRepo());

    const { result } = renderHookWithProviders(() => useRepoDetailViewModel('facebook', 'react'), {
      useCases: { getRepoDetailsUseCase: makeDetailsUseCase(execute) },
    });

    await act(async () => {
      result.current[1].retry();
    });

    expect(execute).toHaveBeenCalled();
  });
});
