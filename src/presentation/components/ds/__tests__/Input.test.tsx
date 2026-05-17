import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { Input } from '@ds/Input';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Input', () => {
  it('calls onChangeText when text is typed', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithProviders(
      <Input placeholder="Type here" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(getByPlaceholderText('Type here'), 'hello');

    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('renders leftIcon when provided', () => {
    const { getByText } = renderWithProviders(<Input leftIcon={<Text>LEFT</Text>} />);

    expect(getByText('LEFT')).toBeTruthy();
  });

  it('renders rightIcon when provided', () => {
    const { getByText } = renderWithProviders(<Input rightIcon={<Text>RIGHT</Text>} />);

    expect(getByText('RIGHT')).toBeTruthy();
  });

  it('renders without crash when no icons provided', () => {
    expect(() => renderWithProviders(<Input placeholder="Search" />)).not.toThrow();
  });

  it('renders without crash with value prop', () => {
    expect(() =>
      renderWithProviders(<Input value="some value" onChangeText={() => {}} />),
    ).not.toThrow();
  });
});
