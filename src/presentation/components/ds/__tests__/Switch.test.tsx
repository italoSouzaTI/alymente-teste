import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Switch } from '@ds/Switch';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Switch', () => {
  it('renders without crash when value is false', () => {
    expect(() =>
      renderWithProviders(<Switch value={false} onValueChange={() => {}} />),
    ).not.toThrow();
  });

  it('renders without crash when value is true', () => {
    expect(() =>
      renderWithProviders(<Switch value={true} onValueChange={() => {}} />),
    ).not.toThrow();
  });

  it('calls onValueChange with toggled value when pressed', () => {
    const onValueChange = jest.fn();
    const { getByRole } = renderWithProviders(
      <Switch value={false} onValueChange={onValueChange} />,
    );

    fireEvent.press(getByRole('switch'));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('calls onValueChange with false when currently true', () => {
    const onValueChange = jest.fn();
    const { getByRole } = renderWithProviders(
      <Switch value={true} onValueChange={onValueChange} />,
    );

    fireEvent.press(getByRole('switch'));

    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('renders with accessibilityLabel', () => {
    const { getByLabelText } = renderWithProviders(
      <Switch value={false} onValueChange={() => {}} accessibilityLabel="Toggle theme" />,
    );

    expect(getByLabelText('Toggle theme')).toBeTruthy();
  });
});
