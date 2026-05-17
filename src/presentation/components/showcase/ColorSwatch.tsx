import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../theme/useColors';
import { radii, spacing } from '../ds/tokens';
import { Text } from '../ds/Text';

interface ColorSwatchProps {
  name: string;
  value: string;
}

export function ColorSwatch({ name, value }: ColorSwatchProps) {
  const c = useColors();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.swatch, { backgroundColor: value, borderColor: c.outlineVariant }]} />
      <Text variant="labelSm" style={{ textAlign: 'center' }} numberOfLines={1}>
        {name}
      </Text>
      <Text variant="labelSm" color="muted" style={{ textAlign: 'center' }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: spacing.gutterSm, width: 72 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
  },
});
