import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { RepoCard } from '@components/repo/RepoCard';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { makeRepo } from '../../../../test-utils/fixtures';

describe('RepoCard', () => {
  it('renders fullName of the repo', () => {
    const repo = makeRepo({ fullName: 'facebook/react' });
    const { getByText } = renderWithProviders(<RepoCard repo={repo} />);

    expect(getByText('facebook/react')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const repo = makeRepo({ fullName: 'facebook/react' });
    const { getByText } = renderWithProviders(<RepoCard repo={repo} onPress={onPress} />);

    fireEvent.press(getByText('facebook/react'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders language badge when language is present', () => {
    const repo = makeRepo({ language: 'TypeScript' });
    const { getByText } = renderWithProviders(<RepoCard repo={repo} />);

    expect(getByText('TypeScript')).toBeTruthy();
  });

  it('does not render language badge when language is null', () => {
    const repo = makeRepo({ language: null });
    const { queryByText } = renderWithProviders(<RepoCard repo={repo} />);

    expect(queryByText('TypeScript')).toBeNull();
  });

  it('renders description when present', () => {
    const repo = makeRepo({ description: 'The library for web UIs' });
    const { getByText } = renderWithProviders(<RepoCard repo={repo} />);

    expect(getByText('The library for web UIs')).toBeTruthy();
  });

  it('does not render description when null', () => {
    const repo = makeRepo({ description: null });
    const { queryByText } = renderWithProviders(<RepoCard repo={repo} />);

    expect(queryByText('The library for web UIs')).toBeNull();
  });
});
