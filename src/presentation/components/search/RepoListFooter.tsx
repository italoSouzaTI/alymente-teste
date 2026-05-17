import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../ds/tokens';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Text } from '../ds/Text';

interface RepoListFooterProps {
  isFetchingMore: boolean;
  hasNextPage: boolean;
}

export function RepoListFooter({ isFetchingMore, hasNextPage }: RepoListFooterProps) {
  if (isFetchingMore) {
    return <LoadingSpinner size="small" />;
  }

  if (!hasNextPage) {
    return (
      <View style={styles.end}>
        <Text variant="labelSm" color="muted">
          — Fim dos resultados —
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  end: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
