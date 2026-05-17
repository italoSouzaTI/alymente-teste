import React from 'react';
import { MagnifyingGlassIcon } from 'phosphor-react-native';
import { EmptyState } from '@components/common/EmptyState';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('EmptyState', () => {
  it('renders title text', () => {
    const { getByText } = renderWithProviders(
      <EmptyState icon={MagnifyingGlassIcon} title="Nenhum resultado" />,
    );

    expect(getByText('Nenhum resultado')).toBeTruthy();
  });

  it('renders description when provided', () => {
    const { getByText } = renderWithProviders(
      <EmptyState
        icon={MagnifyingGlassIcon}
        title="Nenhum resultado"
        description="Tente outra busca"
      />,
    );

    expect(getByText('Tente outra busca')).toBeTruthy();
  });

  it('does not render description when not provided', () => {
    const { queryByText } = renderWithProviders(
      <EmptyState icon={MagnifyingGlassIcon} title="Nenhum resultado" />,
    );

    expect(queryByText('Tente outra busca')).toBeNull();
  });

  it('renders without crash with MagnifyingGlassIcon', () => {
    expect(() =>
      renderWithProviders(<EmptyState icon={MagnifyingGlassIcon} title="Empty" />),
    ).not.toThrow();
  });
});
