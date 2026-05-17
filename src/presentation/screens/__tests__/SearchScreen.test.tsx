import React from 'react';
import { SearchScreen } from '@screens/SearchScreen';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import type { SearchViewState, SearchViewActions } from '@viewmodels/useSearchViewModel';

jest.mock('@viewmodels/useSearchViewModel', () => ({
  useSearchViewModel: jest.fn(),
}));

jest.mock('@infrastructure/di/container', () => ({
  searchReposUseCase: { execute: jest.fn() },
  getRepoDetailsUseCase: { execute: jest.fn() },
  getRepoIssuesUseCase: { execute: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useSearchViewModel } = require('@viewmodels/useSearchViewModel') as {
  useSearchViewModel: jest.Mock;
};

const mockState: SearchViewState = {
  query: '',
  repos: [],
  isLoading: false,
  isFetchingMore: false,
  isRefreshing: false,
  error: null,
  hasNextPage: false,
  totalCount: 0,
};

const mockActions: SearchViewActions = {
  setQuery: jest.fn(),
  loadMore: jest.fn(),
  refresh: jest.fn(),
  retry: jest.fn(),
};

const mockRoute = {
  key: 'Search',
  name: 'Search' as const,
  params: undefined,
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => () => {}),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => false),
  isFocused: jest.fn(() => true),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  removeListener: jest.fn(),
};

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchViewModel.mockReturnValue([mockState, mockActions]);
  });

  it('renders without crash', () => {
    expect(() =>
      renderWithProviders(
        <SearchScreen route={mockRoute as never} navigation={mockNavigation as never} />,
        { withNavigation: true },
      ),
    ).not.toThrow();
  });

  it('renders the search bar placeholder', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <SearchScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    expect(getByPlaceholderText('Buscar repositório...')).toBeTruthy();
  });

  it('renders empty state with initial empty query', () => {
    const { getByText } = renderWithProviders(
      <SearchScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    expect(getByText('Encontre repositórios')).toBeTruthy();
  });
});
