import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { ThemeModeProvider, useThemeMode } from '@theme/ThemeModeContext';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';

function ThemeDisplay() {
  const { isDark, mode, toggle } = useThemeMode();
  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="isDark">{String(isDark)}</Text>
      <Text testID="toggle" onPress={toggle}>
        toggle
      </Text>
    </>
  );
}

describe('ThemeModeContext', () => {
  it('starts with light mode by default', () => {
    const { getByTestId } = render(
      <ThemeModeProvider>
        <ThemeDisplay />
      </ThemeModeProvider>,
    );

    expect(getByTestId('mode').props.children).toBe('light');
    expect(getByTestId('isDark').props.children).toBe('false');
  });

  it('toggles to dark mode when toggle is called', () => {
    const { getByTestId } = render(
      <ThemeModeProvider>
        <ThemeDisplay />
      </ThemeModeProvider>,
    );

    act(() => {
      fireEvent.press(getByTestId('toggle'));
    });

    expect(getByTestId('mode').props.children).toBe('dark');
    expect(getByTestId('isDark').props.children).toBe('true');
  });

  it('toggles back to light after two toggles', () => {
    const { getByTestId } = render(
      <ThemeModeProvider>
        <ThemeDisplay />
      </ThemeModeProvider>,
    );

    act(() => {
      fireEvent.press(getByTestId('toggle'));
    });
    act(() => {
      fireEvent.press(getByTestId('toggle'));
    });

    expect(getByTestId('mode').props.children).toBe('light');
  });

  it('throws when useThemeMode is used outside ThemeModeProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeDisplay />);
    }).toThrow('useThemeMode must be used inside ThemeModeProvider');

    spy.mockRestore();
  });
});

// Suppress React act() warnings in tests
describe('ThemeModeContext via renderWithProviders', () => {
  it('provides ThemeModeContext through renderWithProviders wrapper', () => {
    const { getByTestId } = renderWithProviders(<ThemeDisplay />);

    expect(getByTestId('mode')).toBeTruthy();
  });
});
