import { act } from '@testing-library/react-native';
import { useIssuesViewModel } from '@viewmodels/useIssuesViewModel';
import { renderHookWithProviders } from '../../../test-utils/renderWithProviders';
import { makeIssue, makePaginated } from '../../../test-utils/fixtures';
import { RateLimitError } from '@domain/errors/GitHubErrors';

function makeIssuesUseCase(impl?: jest.Mock) {
  return { execute: impl ?? jest.fn() } as never;
}

describe('useIssuesViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'), {
      useCases: {
        getRepoIssuesUseCase: makeIssuesUseCase(jest.fn().mockResolvedValue(makePaginated([]))),
      },
    });
    const [state] = result.current;

    expect(state.issues).toHaveLength(0);
    expect(state.error).toBeNull();
    expect(state.hasNextPage).toBe(false);
  });

  it('populates issues after successful execute', async () => {
    const issues = [makeIssue({ title: 'Fix memory leak', number: 100 })];
    const execute = jest.fn().mockResolvedValue(makePaginated(issues));

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'), {
      useCases: { getRepoIssuesUseCase: makeIssuesUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.issues).toHaveLength(1);
    expect(state.issues[0].title).toBe('Fix memory leak');
  });

  it('calls execute with correct params', async () => {
    const execute = jest.fn().mockResolvedValue(makePaginated([]));

    renderHookWithProviders(() => useIssuesViewModel('torvalds', 'linux'), {
      useCases: { getRepoIssuesUseCase: makeIssuesUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(execute).toHaveBeenCalledWith({ owner: 'torvalds', repo: 'linux', page: 1 });
  });

  it('sets error message on RateLimitError', async () => {
    const execute = jest.fn().mockRejectedValue(new RateLimitError());

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'), {
      useCases: { getRepoIssuesUseCase: makeIssuesUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.error).toBeTruthy();
  });

  it('does not fetch when owner or repo is empty', () => {
    const execute = jest.fn();

    const { result } = renderHookWithProviders(() => useIssuesViewModel('', ''), {
      useCases: { getRepoIssuesUseCase: makeIssuesUseCase(execute) },
    });
    const [state] = result.current;

    expect(state.issues).toHaveLength(0);
    expect(execute).not.toHaveBeenCalled();
  });

  it('sets hasNextPage correctly', async () => {
    const execute = jest.fn().mockResolvedValue(makePaginated([makeIssue()], true));

    const { result } = renderHookWithProviders(() => useIssuesViewModel('facebook', 'react'), {
      useCases: { getRepoIssuesUseCase: makeIssuesUseCase(execute) },
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.hasNextPage).toBe(true);
  });
});
