import React from 'react';
import { IssueLabelChip } from '@components/issues/IssueLabelChip';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { makeLabel } from '../../../../test-utils/fixtures';

describe('IssueLabelChip', () => {
  it('renders label name', () => {
    const label = makeLabel({ name: 'bug' });
    const { getByText } = renderWithProviders(<IssueLabelChip label={label} />);

    expect(getByText('bug')).toBeTruthy();
  });

  it('renders without crash with a valid hex color', () => {
    const label = makeLabel({ color: 'ee0701', name: 'critical' });

    expect(() => renderWithProviders(<IssueLabelChip label={label} />)).not.toThrow();
  });

  it('renders different label names correctly', () => {
    const label = makeLabel({ name: 'enhancement', color: '84b6eb' });
    const { getByText } = renderWithProviders(<IssueLabelChip label={label} />);

    expect(getByText('enhancement')).toBeTruthy();
  });
});
