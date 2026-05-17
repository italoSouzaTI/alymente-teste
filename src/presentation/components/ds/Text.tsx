import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';
import { useColors } from '../../theme/useColors';
import { typography } from './tokens';

type Variant = keyof typeof typography;
type Color = 'default' | 'muted' | 'primary' | 'success' | 'error' | 'inverse' | 'warning';

interface DSTextProps extends TextProps {
  variant?: Variant;
  color?: Color;
}

export function Text({ variant = 'bodyMd', color = 'default', style, ...rest }: DSTextProps) {
  const c = useColors();

  const colorMap: Record<Color, string> = {
    default: c.onSurface,
    muted: c.onSurfaceVariant,
    primary: c.primaryAction,
    success: c.success,
    error: c.error,
    inverse: c.onPrimary,
    warning: c.warning,
  };

  return <RNText style={[typography[variant], { color: colorMap[color] }, style]} {...rest} />;
}
