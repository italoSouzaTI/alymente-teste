import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { useColors } from '@theme/useColors';
import { radii, spacing } from './tokens';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({ children, onPress, style }: CardProps) {
  const c = useColors();

  const baseStyle: ViewStyle = {
    backgroundColor: c.surfaceWhite,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: c.outlineVariant,
    padding: spacing.lg,
  };

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [baseStyle, pressed && { backgroundColor: c.surfaceLow }, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[baseStyle, style]}>{children}</View>;
}
