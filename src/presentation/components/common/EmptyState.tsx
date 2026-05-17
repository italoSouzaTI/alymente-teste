import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { spacing } from '../ds/tokens';
import { Text } from '../ds/Text';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description?: string;
}

export function EmptyState({ emoji, title, description }: EmptyStateProps) {
  return (
    <View style={styles.wrapper}>
      <RNText style={styles.emoji}>{emoji}</RNText>
      <Text variant="headlineSm" style={styles.center}>
        {title}
      </Text>
      {description != null && (
        <Text variant="bodySm" color="muted" style={styles.center}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  emoji: { fontSize: 48, textAlign: 'center' },
  center: { textAlign: 'center' },
});
