import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ClockCounterClockwise, MagnifyingGlass } from 'phosphor-react-native';
import type { RecentSearch } from '@hooks/useRecentSearches';
import { Text } from '@ds/Text';
import { spacing, radii } from '@ds/tokens';
import { useColors } from '@theme/useColors';

interface RecentSearchesListProps {
  searches: RecentSearch[];
  onSelect: (query: string) => void;
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k resultados`;
  return `${count} resultados`;
}

export function RecentSearchesList({ searches, onSelect }: RecentSearchesListProps) {
  const c = useColors();

  return (
    <ScrollView
      testID="recent-searches-list"
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <ClockCounterClockwise size={16} color={c.onSurfaceVariant} />
        <Text variant="labelMd" color="muted">
          Buscas recentes (offline)
        </Text>
      </View>

      {searches.map((item) => (
        <Pressable
          key={item.query}
          onPress={() => onSelect(item.query)}
          style={({ pressed }) => [
            styles.item,
            { backgroundColor: pressed ? c.surfaceContainer : c.surfaceWhite },
            { borderColor: c.outlineVariant },
          ]}
        >
          <MagnifyingGlass size={16} color={c.onSurfaceVariant} />
          <View style={styles.itemText}>
            <Text variant="bodyMd">{item.query}</Text>
            <Text variant="labelMd" color="muted">
              {formatCount(item.totalCount)}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.containerMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.gutterSm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
    marginBottom: spacing.gutterSm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  itemText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.gutterMd,
  },
});
