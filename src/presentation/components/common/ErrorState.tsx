import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { spacing } from '../ds/tokens';
import { Button } from '../ds/Button';
import { Text } from '../ds/Text';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrapper}>
      <RNText style={styles.emoji}>⚠️</RNText>
      <Text variant="headlineSm" style={styles.center}>
        Algo deu errado
      </Text>
      <Text variant="bodySm" color="muted" style={styles.center}>
        {message}
      </Text>
      {onRetry != null && <Button label="Tentar novamente" variant="secondary" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  emoji: { fontSize: 40, textAlign: 'center' },
  center: { textAlign: 'center' },
});
