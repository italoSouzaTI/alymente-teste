import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Label } from '@domain/entities/Label';
import { Text } from '@ds/Text';
import { radii, spacing } from '@ds/tokens';
import { useThemeMode } from '@theme/ThemeModeContext';

interface IssueLabelChipProps {
  label: Label;
}

function parseHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function labelTextColor(hex: string, isDark: boolean): string {
  const [r, g, b] = parseHex(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (isDark && brightness < 100) {
    // Dark mode + cor escura → clareia para contrastar com o fundo escuro
    const l = (ch: number) => Math.min(255, Math.round(ch + (255 - ch) * 0.55));
    return `rgb(${l(r)}, ${l(g)}, ${l(b)})`;
  }
  if (!isDark && brightness > 160) {
    // Light mode + cor clara → escurece para contrastar com o fundo claro
    const d = (ch: number) => Math.round(ch * 0.45);
    return `rgb(${d(r)}, ${d(g)}, ${d(b)})`;
  }
  return `#${hex}`;
}

export function IssueLabelChip({ label }: IssueLabelChipProps) {
  const { isDark } = useThemeMode();
  const bg = hexToRgba(label.color, 0.18);
  const border = hexToRgba(label.color, 0.5);
  const textColor = labelTextColor(label.color, isDark);

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
