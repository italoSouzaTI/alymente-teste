import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { ErrorBoundary } from '@components/common/ErrorBoundary';

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Teste de erro');
  return <Text>Conteúdo OK</Text>;
}

describe('ErrorBoundary', () => {
  it('renderiza filhos normalmente quando não há erro', () => {
    const { getByText } = renderWithProviders(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(getByText('Conteúdo OK')).toBeTruthy();
  });

  it('exibe fallback quando filho lança erro', () => {
    const { getByText } = renderWithProviders(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    expect(getByText('Algo deu errado')).toBeTruthy();
    expect(getByText('Teste de erro')).toBeTruthy();
  });

  it('exibe botão de retry no fallback', () => {
    const { getByText } = renderWithProviders(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(getByText('Tentar novamente')).toBeTruthy();
    expect(() => fireEvent.press(getByText('Tentar novamente'))).not.toThrow();
  });
});
