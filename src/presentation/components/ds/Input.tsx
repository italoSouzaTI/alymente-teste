import React, { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { useColors } from '@theme/useColors';
import { radii, spacing, typography } from './tokens';

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({ leftIcon, rightIcon, containerStyle, style, ...rest }: InputProps) {
  const c = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: focused ? c.surfaceWhite : c.surfaceLow,
          borderColor: focused ? c.primaryAction : c.outlineVariant,
        },
        containerStyle,
      ]}
    >
      {leftIcon != null && <View style={styles.icon}>{leftIcon}</View>}
      <TextInput
        style={[styles.input, { color: c.onSurface }, style]}
        placeholderTextColor={c.outline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {rightIcon != null && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    paddingVertical: 0,
  },
  icon: {
    marginHorizontal: spacing.gutterSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
