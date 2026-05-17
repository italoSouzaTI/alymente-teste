import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Button } from '@ds/Button';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Button', () => {
  it('renders the label text', () => {
    const { getByText } = renderWithProviders(<Button label="Buscar" onPress={() => {}} />);

    expect(getByText('Buscar')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithProviders(<Button label="Buscar" onPress={onPress} />);

    fireEvent.press(getByText('Buscar'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithProviders(<Button label="Buscar" onPress={onPress} disabled />);

    fireEvent.press(getByText('Buscar'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not show label text when loading (shows spinner instead)', () => {
    const { queryByText } = renderWithProviders(
      <Button label="Buscar" onPress={() => {}} loading />,
    );

    expect(queryByText('Buscar')).toBeNull();
  });

  it('renders without crash with all variants', () => {
    expect(() =>
      renderWithProviders(<Button label="Primary" onPress={() => {}} variant="primary" />),
    ).not.toThrow();

    expect(() =>
      renderWithProviders(<Button label="Secondary" onPress={() => {}} variant="secondary" />),
    ).not.toThrow();

    expect(() =>
      renderWithProviders(<Button label="Success" onPress={() => {}} variant="success" />),
    ).not.toThrow();

    expect(() =>
      renderWithProviders(<Button label="Ghost" onPress={() => {}} variant="ghost" />),
    ).not.toThrow();
  });
});
