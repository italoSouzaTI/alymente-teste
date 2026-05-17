import React from 'react';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('LoadingSpinner', () => {
  it('renders without crash with default props', () => {
    expect(() => renderWithProviders(<LoadingSpinner />)).not.toThrow();
  });

  it('renders without crash with small size', () => {
    expect(() => renderWithProviders(<LoadingSpinner size="small" />)).not.toThrow();
  });

  it('renders without crash with large size', () => {
    expect(() => renderWithProviders(<LoadingSpinner size="large" />)).not.toThrow();
  });

  it('renders without crash in fullScreen mode', () => {
    expect(() => renderWithProviders(<LoadingSpinner fullScreen />)).not.toThrow();
  });
});
