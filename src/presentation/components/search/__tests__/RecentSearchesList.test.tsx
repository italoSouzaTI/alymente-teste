import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { RecentSearchesList } from '../RecentSearchesList';
import type { RecentSearch } from '@hooks/useRecentSearches';

const searches: RecentSearch[] = [
  { query: 'react', totalCount: 1200, updatedAt: 2000 },
  { query: 'vue', totalCount: 800, updatedAt: 1000 },
];

describe('RecentSearchesList', () => {
  it('renderiza os itens de busca recente', () => {
    const { getByText } = renderWithProviders(
      <RecentSearchesList searches={searches} onSelect={jest.fn()} />,
    );
    expect(getByText('react')).toBeTruthy();
    expect(getByText('vue')).toBeTruthy();
  });

  it('exibe o cabeçalho "Buscas recentes (offline)"', () => {
    const { getByText } = renderWithProviders(
      <RecentSearchesList searches={searches} onSelect={jest.fn()} />,
    );
    expect(getByText('Buscas recentes (offline)')).toBeTruthy();
  });

  it('chama onSelect com a query correta ao pressionar um item', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithProviders(
      <RecentSearchesList searches={searches} onSelect={onSelect} />,
    );
    fireEvent.press(getByText('react'));
    expect(onSelect).toHaveBeenCalledWith('react');
  });

  it('formata contagem acima de 1000 como "xk resultados"', () => {
    const { getByText } = renderWithProviders(
      <RecentSearchesList searches={searches} onSelect={jest.fn()} />,
    );
    expect(getByText('1.2k resultados')).toBeTruthy();
    expect(getByText('800 resultados')).toBeTruthy();
  });

  it('renderiza testID correto', () => {
    const { getByTestId } = renderWithProviders(
      <RecentSearchesList searches={searches} onSelect={jest.fn()} />,
    );
    expect(getByTestId('recent-searches-list')).toBeTruthy();
  });
});
