import React from 'react';
import { Avatar } from '@ds/Avatar';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Avatar', () => {
  it('renders without crash when uri is provided', () => {
    expect(() =>
      renderWithProviders(<Avatar uri="https://example.com/avatar.png" />),
    ).not.toThrow();
  });

  it('renders fallback initials when no uri provided', () => {
    const { getByText } = renderWithProviders(<Avatar initials="JD" />);

    expect(getByText('JD')).toBeTruthy();
  });

  it('shows first 2 chars uppercased of initials', () => {
    const { getByText } = renderWithProviders(<Avatar initials="john" />);

    expect(getByText('JO')).toBeTruthy();
  });

  it('shows "?" fallback when no uri and no initials', () => {
    const { getByText } = renderWithProviders(<Avatar />);

    expect(getByText('?')).toBeTruthy();
  });

  it('renders without crash with all size variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const;

    sizes.forEach((size) => {
      expect(() => renderWithProviders(<Avatar initials="AB" size={size} />)).not.toThrow();
    });
  });
});
