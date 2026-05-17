import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@ds/tokens';
import { Text } from '@ds/Text';

interface SearchResultsHeaderProps {
  totalCount: number;
  query: string;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function SearchResultsHeader({ totalCount, query }: SearchResultsHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text variant="labelMd" color="muted">
        {formatCount(totalCount)} resultado{totalCount !== 1 ? 's' : ''} para{' '}
        <Text variant="labelMd" color="primary">
          {`\u201C${query}\u201D`}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.containerMargin,
    paddingTop: spacing.gutterMd,
    paddingBottom: spacing.gutterSm,
  },
});
