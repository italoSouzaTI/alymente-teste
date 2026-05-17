import React from 'react';
import { StarIcon } from 'phosphor-react-native';
import { StatCard } from '@components/repo-detail/StatCard';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('StatCard', () => {
  it('renders label text', () => {
    const { getByText } = renderWithProviders(
      <StatCard icon={StarIcon} value={1000} label="stars" />,
    );

    expect(getByText('stars')).toBeTruthy();
  });

  it('renders formatted value for numbers under 1000', () => {
    const { getByText } = renderWithProviders(
      <StatCard icon={StarIcon} value={999} label="stars" />,
    );

    expect(getByText('999')).toBeTruthy();
  });

  it('renders formatted value in k notation for 1000+', () => {
    const { getByText } = renderWithProviders(
      <StatCard icon={StarIcon} value={1500} label="stars" />,
    );

    expect(getByText('1.5k')).toBeTruthy();
  });

  it('renders formatted value in M notation for 1000000+', () => {
    const { getByText } = renderWithProviders(
      <StatCard icon={StarIcon} value={1500000} label="stars" />,
    );

    expect(getByText('1.5M')).toBeTruthy();
  });

  it('renders without crash', () => {
    expect(() =>
      renderWithProviders(<StatCard icon={StarIcon} value={42} label="forks" />),
    ).not.toThrow();
  });
});
