import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { useColors } from '../../theme/useColors';
import { Text } from '../ds/Text';
import { radii, spacing } from '../ds/tokens';

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function StatCard({ icon, value, label }: StatCardProps) {
  const c = useColors();

  return (
    <View
      style={[styles.card, { backgroundColor: c.surfaceContainer, borderColor: c.outlineVariant }]}
    >
      <RNText style={styles.icon}>{icon}</RNText>
      <Text variant="headlineMd" style={{ color: c.onSurface }}>
        {formatCount(value)}
      </Text>
      <Text variant="labelMd" color="muted">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.gutterSm,
    minWidth: 72,
  },
  icon: { fontSize: 20 },
});
