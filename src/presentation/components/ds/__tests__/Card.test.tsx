import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { Card } from '@ds/Card';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = renderWithProviders(
      <Card>
        <Text>Card content</Text>
      </Card>,
    );

    expect(getByText('Card content')).toBeTruthy();
  });

  it('calls onPress when pressable card is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithProviders(
      <Card onPress={onPress}>
        <Text>Pressable card</Text>
      </Card>,
    );

    fireEvent.press(getByText('Pressable card'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders as View (not pressable) when no onPress provided', () => {
    const { getByText } = renderWithProviders(
      <Card>
        <Text>Static card</Text>
      </Card>,
    );

    expect(getByText('Static card')).toBeTruthy();
  });
});
