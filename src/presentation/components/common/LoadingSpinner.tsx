import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useColors } from '../../theme/useColors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', fullScreen = false }: LoadingSpinnerProps) {
  const c = useColors();

  return (
    <View style={[styles.wrapper, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={c.primaryAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  fullScreen: { flex: 1 },
});
