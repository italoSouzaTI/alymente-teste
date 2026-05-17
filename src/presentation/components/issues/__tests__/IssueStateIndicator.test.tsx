import React from 'react';
import { IssueStateIndicator } from '@components/issues/IssueStateIndicator';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('IssueStateIndicator', () => {
  it('renders without crash when state is open', () => {
    expect(() => renderWithProviders(<IssueStateIndicator state="open" />)).not.toThrow();
  });

  it('renders without crash when state is closed', () => {
    expect(() => renderWithProviders(<IssueStateIndicator state="closed" />)).not.toThrow();
  });

  it('renders open state indicator', () => {
    const { UNSAFE_root } = renderWithProviders(<IssueStateIndicator state="open" />);

    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders closed state indicator', () => {
    const { UNSAFE_root } = renderWithProviders(<IssueStateIndicator state="closed" />);

    expect(UNSAFE_root).toBeTruthy();
  });
});
