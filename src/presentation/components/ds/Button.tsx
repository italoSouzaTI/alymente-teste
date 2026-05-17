import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useColors } from '../../theme/useColors';
import { radii, spacing } from './tokens';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'success' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const sizes: Record<Size, { py: number; px: number; fontSize: number }> = {
  sm: { py: spacing.gutterMd, px: spacing.sm, fontSize: 13 },
  md: { py: 10, px: spacing.lg, fontSize: 14 },
  lg: { py: spacing.md, px: spacing.xl, fontSize: 16 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const c = useColors();
  const s = sizes[size];

  const variants: Record<Variant, { bg: string; text: string; border?: string }> = {
    primary: { bg: c.primaryAction, text: c.onPrimary },
    secondary: { bg: c.surfaceWhite, text: c.onSurface, border: c.outlineVariant },
    success: { bg: c.successAction, text: c.onSuccess },
    ghost: { bg: 'transparent', text: c.primaryAction },
  };

  const v = variants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderWidth: v.border != null ? 1 : 0,
          borderColor: v.border,
          opacity: pressed || disabled ? 0.6 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <Text
          style={{
            fontSize: s.fontSize,
            fontWeight: '600',
            color: v.text,
            lineHeight: s.fontSize * 1.4,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.gutterMd,
  },
});
