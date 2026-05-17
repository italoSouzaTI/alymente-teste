import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { ThemeModeProvider, useThemeMode } from '@theme/ThemeModeContext';
import { useColors } from '@theme/useColors';
import { lightColors, darkColors } from '@ds/tokens';

function ColorsDisplay() {
  const colors = useColors();
  const { toggle } = useThemeMode();
  return (
    <>
      <Text testID="primaryAction">{colors.primaryAction}</Text>
      <Text testID="background">{colors.background}</Text>
      <Text testID="toggle" onPress={toggle}>
        toggle
      </Text>
    </>
  );
}

describe('useColors', () => {
  it('returns lightColors when mode is light', () => {
    const { getByTestId } = render(
      <ThemeModeProvider>
        <ColorsDisplay />
      </ThemeModeProvider>,
    );

    expect(getByTestId('primaryAction').props.children).toBe(lightColors.primaryAction);
    expect(getByTestId('background').props.children).toBe(lightColors.background);
  });

  it('returns darkColors when mode is dark', () => {
    const { getByTestId } = render(
      <ThemeModeProvider>
        <ColorsDisplay />
      </ThemeModeProvider>,
    );

    act(() => {
      fireEvent.press(getByTestId('toggle'));
    });

    expect(getByTestId('primaryAction').props.children).toBe(darkColors.primaryAction);
    expect(getByTestId('background').props.children).toBe(darkColors.background);
  });

  it('returns different colors in light and dark modes', () => {
    expect(lightColors.primaryAction).not.toBe(darkColors.primaryAction);
    expect(lightColors.background).not.toBe(darkColors.background);
  });
});
