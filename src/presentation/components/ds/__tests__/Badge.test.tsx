import React from 'react';
import { Badge } from '@ds/Badge';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Badge', () => {
  it('renders label text', () => {
    const { getByText } = renderWithProviders(<Badge label="TypeScript" />);

    expect(getByText('TypeScript')).toBeTruthy();
  });

  it('renders without crash with all variants', () => {
    const variants = ['default', 'primary', 'success', 'error', 'warning', 'outline'] as const;

    variants.forEach((variant) => {
      expect(() => renderWithProviders(<Badge label="Test" variant={variant} />)).not.toThrow();
    });
  });

  it('renders without crash with dot color', () => {
    expect(() => renderWithProviders(<Badge label="TypeScript" dot="#3178c6" />)).not.toThrow();
  });
});
