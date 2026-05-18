import React from 'react';
import { IssuesScreen } from '@screens/IssuesScreen';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import type { IssuesViewState, IssuesViewActions } from '@viewmodels/useIssuesViewModel';

jest.mock('@viewmodels/useIssuesViewModel', () => ({
  useIssuesViewModel: jest.fn(),
}));

jest.mock('@infrastructure/di/container', () => ({
  searchReposUseCase: { execute: jest.fn() },
  getRepoDetailsUseCase: { execute: jest.fn() },
  getRepoIssuesUseCase: { execute: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useIssuesViewModel } = require('@viewmodels/useIssuesViewModel') as {
  useIssuesViewModel: jest.Mock;
};

const mockActions: IssuesViewActions = {
  loadMore: jest.fn(),
  refresh: jest.fn(),
  retry: jest.fn(),
};

const mockRoute = {
  key: 'Issues',
  name: 'Issues' as const,
  params: { owner: 'facebook', repo: 'react', repoName: 'facebook/react' },
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => () => {}),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
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

describe('IssuesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crash', () => {
    const state: IssuesViewState = {
      issues: [],
      isLoading: false,
      isFetchingMore: false,
      isRefreshing: false,
      error: null,
      hasNextPage: false,
    };
    useIssuesViewModel.mockReturnValue([state, mockActions]);

    expect(() =>
      renderWithProviders(
        <IssuesScreen route={mockRoute as never} navigation={mockNavigation as never} />,
        { withNavigation: true },
      ),
    ).not.toThrow();
  });

  it('renders EmptyState when issues list is empty', () => {
    const state: IssuesViewState = {
      issues: [],
      isLoading: false,
      isFetchingMore: false,
      isRefreshing: false,
      error: null,
      hasNextPage: false,
    };
    useIssuesViewModel.mockReturnValue([state, mockActions]);

    const { getByText } = renderWithProviders(
      <IssuesScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    expect(getByText('Sem issues abertas')).toBeTruthy();
  });

  it('renders skeleton when isLoading is true', () => {
    const state: IssuesViewState = {
      issues: [],
      isLoading: true,
      isFetchingMore: false,
      isRefreshing: false,
      error: null,
      hasNextPage: false,
    };
    useIssuesViewModel.mockReturnValue([state, mockActions]);

    const { getByTestId } = renderWithProviders(
      <IssuesScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    expect(getByTestId('issue-list-skeleton')).toBeTruthy();
  });

  it('renders error state when error is present', () => {
    const state: IssuesViewState = {
      issues: [],
      isLoading: false,
      isFetchingMore: false,
      isRefreshing: false,
      error: 'Sem conexão com a internet.',
      hasNextPage: false,
    };
    useIssuesViewModel.mockReturnValue([state, mockActions]);

    const { getByText } = renderWithProviders(
      <IssuesScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    expect(getByText('Sem conexão com a internet.')).toBeTruthy();
  });
});
