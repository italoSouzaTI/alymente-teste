import { MoonIcon, SunIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@theme/useColors';
import { useThemeMode } from '@theme/ThemeModeContext';
import { spacing } from './tokens';
import { Switch } from './Switch';

export function ThemeSwitch() {
  const { isDark, toggle } = useThemeMode();
  const c = useColors();

  return (
    <View style={styles.row}>
      <SunIcon size={16} color={c.onSurfaceVariant} weight="fill" />
      <Switch value={isDark} onValueChange={toggle} accessibilityLabel="Alternar dark mode" />
      <MoonIcon size={16} color={c.onSurfaceVariant} weight="fill" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
  },
});
