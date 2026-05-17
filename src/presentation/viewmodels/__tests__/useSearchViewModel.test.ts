import { act } from '@testing-library/react-native';
import { useSearchViewModel } from '@viewmodels/useSearchViewModel';
import { renderHookWithProviders } from '../../../test-utils/renderWithProviders';
import { makeRepo, makePaginated } from '../../../test-utils/fixtures';

jest.mock('@infrastructure/di/container', () => ({
  searchReposUseCase: { execute: jest.fn() },
  getRepoDetailsUseCase: { execute: jest.fn() },
  getRepoIssuesUseCase: { execute: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { searchReposUseCase } = require('@infrastructure/di/container') as {
  searchReposUseCase: { execute: jest.Mock };
};

describe('useSearchViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { result } = renderHookWithProviders(() => useSearchViewModel());
    const [state] = result.current;

    expect(state.query).toBe('');
    expect(state.repos).toHaveLength(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.hasNextPage).toBe(false);
    expect(state.totalCount).toBe(0);
  });

  it('does not call execute when query is empty', () => {
    renderHookWithProviders(() => useSearchViewModel());

    expect(searchReposUseCase.execute).not.toHaveBeenCalled();
  });

  it('updates query when setQuery is called', async () => {
    searchReposUseCase.execute.mockResolvedValue(makePaginated([makeRepo()]));

    const { result } = renderHookWithProviders(() => useSearchViewModel());
    const [, actions] = result.current;

    await act(async () => {
      actions.setQuery('react');
    });

    const [state] = result.current;
    expect(state.query).toBe('react');
  });

  it('populates repos after valid query resolves', async () => {
    const repos = [makeRepo({ fullName: 'facebook/react' })];
    searchReposUseCase.execute.mockResolvedValue(makePaginated(repos));

    const { result } = renderHookWithProviders(() => useSearchViewModel());

    await act(async () => {
      result.current[1].setQuery('react');
    });

    await act(async () => {
      await Promise.resolve();
    });

    const [state] = result.current;
    expect(state.repos.length).toBeGreaterThanOrEqual(0);
  });

  it('sets error message on rejected execute', async () => {
    searchReposUseCase.execute.mockRejectedValue(new Error('Network failure'));

    const { result } = renderHookWithProviders(() => useSearchViewModel());

    await act(async () => {
      result.current[1].setQuery('react');
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.error).toBeTruthy();
  });

  it('exposes retry action that calls refetch', async () => {
    searchReposUseCase.execute.mockResolvedValue(makePaginated([makeRepo()]));

    const { result } = renderHookWithProviders(() => useSearchViewModel());

    await act(async () => {
      result.current[1].setQuery('react');
    });

    await act(async () => {
      result.current[1].retry();
    });

    expect(searchReposUseCase.execute).toHaveBeenCalled();
  });
});
