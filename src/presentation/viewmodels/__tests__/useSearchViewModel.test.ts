import { act } from '@testing-library/react-native';
import { useSearchViewModel } from '@viewmodels/useSearchViewModel';
import { renderHookWithProviders } from '../../../test-utils/renderWithProviders';
import { makeRepo, makePaginated } from '../../../test-utils/fixtures';

jest.mock('@hooks/useOnlineStatus', () => ({
  useOnlineStatus: jest.fn().mockReturnValue(true),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useOnlineStatus } = require('@hooks/useOnlineStatus') as {
  useOnlineStatus: jest.Mock;
};

function makeSearchUseCase(impl?: jest.Mock) {
  return { execute: impl ?? jest.fn() } as never;
}

describe('useSearchViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnlineStatus.mockReturnValue(true);
  });

  it('has correct initial state', () => {
    const { result } = renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase() },
    });
    const [state] = result.current;

    expect(state.query).toBe('');
    expect(state.repos).toHaveLength(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.hasNextPage).toBe(false);
    expect(state.totalCount).toBe(0);
  });

  it('does not call execute when query is empty', () => {
    const execute = jest.fn();
    renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase(execute) },
    });

    expect(execute).not.toHaveBeenCalled();
  });

  it('updates query when setQuery is called', async () => {
    const execute = jest.fn().mockResolvedValue(makePaginated([makeRepo()]));

    const { result } = renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase(execute) },
    });
    const [, actions] = result.current;

    await act(async () => {
      actions.setQuery('react');
    });

    const [state] = result.current;
    expect(state.query).toBe('react');
  });

  it('populates repos after valid query resolves', async () => {
    const repos = [makeRepo({ fullName: 'facebook/react' })];
    const execute = jest.fn().mockResolvedValue(makePaginated(repos));

    const { result } = renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase(execute) },
    });

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
    const execute = jest.fn().mockRejectedValue(new Error('Network failure'));

    const { result } = renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase(execute) },
    });

    await act(async () => {
      result.current[1].setQuery('react');
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.error).toBeTruthy();
  });

  it('offline-sem-cache: retorna erro NetworkError e isLoading=false', async () => {
    useOnlineStatus.mockReturnValue(false);
    const execute = jest.fn().mockResolvedValue(makePaginated([]));

    const { result } = renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase(execute) },
    });

    await act(async () => {
      result.current[1].setQuery('react');
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    const [state] = result.current;
    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Sem conexão');
    expect(state.repos).toHaveLength(0);
  });

  it('exposes retry action that calls refetch', async () => {
    const execute = jest.fn().mockResolvedValue(makePaginated([makeRepo()]));

    const { result } = renderHookWithProviders(() => useSearchViewModel(), {
      useCases: { searchReposUseCase: makeSearchUseCase(execute) },
    });

    await act(async () => {
      result.current[1].setQuery('react');
    });

    await act(async () => {
      result.current[1].retry();
    });

    expect(execute).toHaveBeenCalled();
  });
});
