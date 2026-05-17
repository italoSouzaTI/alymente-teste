import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Label } from '@domain/entities/Label';
import { Text } from '@ds/Text';
import { radii, spacing } from '@ds/tokens';

interface IssueLabelChipProps {
  label: Label;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function IssueLabelChip({ label }: IssueLabelChipProps) {
  const bg = hexToRgba(label.color, 0.18);
  const border = hexToRgba(label.color, 0.5);
  const textColor = `#${label.color}`;

  return (
    <View style={[styles.chip, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.text, { color: textColor }]} numberOfLines={1}>
        {label.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.gutterMd,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
});
