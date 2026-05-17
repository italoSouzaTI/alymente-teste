import React from 'react';
import { Text } from '@ds/Text';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Text', () => {
  it('renders children text', () => {
    const { getByText } = renderWithProviders(<Text>Hello world</Text>);

    expect(getByText('Hello world')).toBeTruthy();
  });

  it('renders without crash with all typography variants', () => {
    const variants = [
      'headlineLg',
      'headlineMd',
      'headlineSm',
      'bodyLg',
      'bodyMd',
      'bodySm',
      'labelMd',
      'labelSm',
      'monoSm',
    ] as const;

    variants.forEach((variant) => {
      expect(() => renderWithProviders(<Text variant={variant}>Sample text</Text>)).not.toThrow();
    });
  });

  it('renders without crash with all color variants', () => {
    const colors = [
      'default',
      'muted',
      'primary',
      'success',
      'error',
      'inverse',
      'warning',
    ] as const;

    colors.forEach((color) => {
      expect(() => renderWithProviders(<Text color={color}>Sample text</Text>)).not.toThrow();
    });
  });
});
