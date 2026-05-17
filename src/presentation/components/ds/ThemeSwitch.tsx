import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeMode } from '../../theme/ThemeModeContext';
import { spacing } from './tokens';
import { Switch } from './Switch';
import { Text } from './Text';

export function ThemeSwitch() {
  const { isDark, toggle } = useThemeMode();

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>☀️</Text>
      <Switch value={isDark} onValueChange={toggle} accessibilityLabel="Alternar dark mode" />
      <Text style={styles.icon}>🌙</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
  },
  icon: {
    fontSize: 16,
  },
});
