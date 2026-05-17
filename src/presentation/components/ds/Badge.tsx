import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useColors } from '../../theme/useColors';
import { radii, spacing, typography } from './tokens';
import { Text } from './Text';

type Variant = 'default' | 'primary' | 'success' | 'error' | 'warning' | 'outline';

interface BadgeProps {
  label: string;
  variant?: Variant;
  dot?: string;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', dot, style }: BadgeProps) {
  const c = useColors();

  const variants: Record<Variant, { bg: string; text: string; border?: string }> = {
    default: { bg: c.surfaceContainer, text: c.onSurfaceVariant },
    primary: { bg: c.primaryContainer, text: c.primaryAction },
    success: { bg: c.successContainer, text: c.success },
    error: { bg: c.errorContainer, text: c.error },
    warning: { bg: c.warningContainer, text: c.warning },
    outline: { bg: 'transparent', text: c.onSurfaceVariant, border: c.outlineVariant },
  };

  const v = variants[variant];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: v.bg, borderWidth: v.border != null ? 1 : 0, borderColor: v.border },
        style,
      ]}
    >
      {dot != null && <View style={[styles.dot, { backgroundColor: dot }]} />}
      <Text style={{ ...typography.labelSm, color: v.text }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gutterMd,
    paddingVertical: spacing.gutterSm,
    borderRadius: radii.full,
    gap: spacing.gutterSm,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
