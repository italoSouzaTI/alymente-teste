import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@components/common/Skeleton';
import { radii, spacing } from '@ds/tokens';
import { useColors } from '@theme/useColors';

function IssueItemSkeleton() {
  const c = useColors();
  return (
    <View style={[styles.item, { backgroundColor: c.surfaceWhite, borderColor: c.outlineVariant }]}>
      <Skeleton width={20} height={20} radius={radii.full} />
      <View style={styles.content}>
        <Skeleton width="80%" height={14} />
        <View style={styles.meta}>
          <Skeleton width={48} height={18} radius={radii.full} />
          <Skeleton width={48} height={18} radius={radii.full} />
          <Skeleton width={60} height={11} />
        </View>
      </View>
      <Skeleton width={20} height={20} radius={radii.full} />
    </View>
  );
}

export function IssueListSkeleton() {
  return (
    <View testID="issue-list-skeleton" style={styles.wrapper}>
      {Array.from({ length: 8 }).map((_, i) => (
        <IssueItemSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  content: { flex: 1, gap: spacing.gutterMd },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.gutterMd },
});
