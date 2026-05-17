import React from 'react';
import { RepoDetailScreen } from '@screens/RepoDetailScreen';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { makeRepo } from '../../../test-utils/fixtures';
import type {
  RepoDetailViewState,
  RepoDetailViewActions,
} from '@viewmodels/useRepoDetailViewModel';

jest.mock('@viewmodels/useRepoDetailViewModel', () => ({
  useRepoDetailViewModel: jest.fn(),
}));

jest.mock('@infrastructure/di/container', () => ({
  searchReposUseCase: { execute: jest.fn() },
  getRepoDetailsUseCase: { execute: jest.fn() },
  getRepoIssuesUseCase: { execute: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useRepoDetailViewModel } = require('@viewmodels/useRepoDetailViewModel') as {
  useRepoDetailViewModel: jest.Mock;
};

const mockActions: RepoDetailViewActions = {
  retry: jest.fn(),
};

const mockRoute = {
  key: 'RepoDetail',
  name: 'RepoDetail' as const,
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

describe('RepoDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when isLoading is true', () => {
    const state: RepoDetailViewState = { repo: null, isLoading: true, error: null };
    useRepoDetailViewModel.mockReturnValue([state, mockActions]);

    expect(() =>
      renderWithProviders(
        <RepoDetailScreen route={mockRoute as never} navigation={mockNavigation as never} />,
        { withNavigation: true },
      ),
    ).not.toThrow();
  });

  it('renders error state when error is present', () => {
    const state: RepoDetailViewState = {
      repo: null,
      isLoading: false,
      error: 'Repositório não encontrado.',
    };
    useRepoDetailViewModel.mockReturnValue([state, mockActions]);

    const { getByText } = renderWithProviders(
      <RepoDetailScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    expect(getByText('Repositório não encontrado.')).toBeTruthy();
  });

  it('renders repo details when repo is available', () => {
    const repo = makeRepo({ fullName: 'facebook/react', name: 'react' });
    const state: RepoDetailViewState = { repo, isLoading: false, error: null };
    useRepoDetailViewModel.mockReturnValue([state, mockActions]);

    const { getByText } = renderWithProviders(
      <RepoDetailScreen route={mockRoute as never} navigation={mockNavigation as never} />,
      { withNavigation: true },
    );

    // RepoDetailHeader renders repo.name and repo.owner.login separately
    expect(getByText('react')).toBeTruthy();
    expect(getByText('owner')).toBeTruthy();
  });
});
