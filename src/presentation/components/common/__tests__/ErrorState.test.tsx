import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ErrorState } from '@components/common/ErrorState';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('ErrorState', () => {
  it('renders error message', () => {
    const { getByText } = renderWithProviders(<ErrorState message="Sem conexão com a internet." />);

    expect(getByText('Sem conexão com a internet.')).toBeTruthy();
  });

  it('renders retry button when onRetry is provided', () => {
    const { getByText } = renderWithProviders(<ErrorState message="Erro" onRetry={() => {}} />);

    expect(getByText('Tentar novamente')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = renderWithProviders(<ErrorState message="Erro" onRetry={onRetry} />);

    fireEvent.press(getByText('Tentar novamente'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    const { queryByText } = renderWithProviders(<ErrorState message="Erro" />);

    expect(queryByText('Tentar novamente')).toBeNull();
  });
});
