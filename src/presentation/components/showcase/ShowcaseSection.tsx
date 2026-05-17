import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@theme/useColors';
import { spacing, typography } from '@ds/tokens';
import { Text } from '@ds/Text';

interface ShowcaseSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
  const c = useColors();

  return (
    <View style={styles.wrapper}>
      <Text variant="headlineSm" style={styles.title}>
        {title}
      </Text>
      <View
        style={[styles.content, { borderColor: c.outlineVariant, backgroundColor: c.surfaceWhite }]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  title: { ...typography.labelMd, letterSpacing: 0.8 },
  content: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
