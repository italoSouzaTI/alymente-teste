import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '../../theme/useColors';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, style }: ScreenProps) {
  const c = useColors();

  return <View style={[styles.screen, { backgroundColor: c.background }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
