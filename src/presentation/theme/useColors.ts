import { darkColors, lightColors, type ColorPalette } from '../components/ds/tokens';
import { useThemeMode } from './ThemeModeContext';

export function useColors(): ColorPalette {
  const { isDark } = useThemeMode();
  return isDark ? darkColors : lightColors;
}
