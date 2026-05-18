import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@components/common/Skeleton';
import { radii, spacing } from '@ds/tokens';
import { useColors } from '@theme/useColors';

function RepoCardSkeleton() {
  const c = useColors();
  return (
    <View style={[styles.card, { backgroundColor: c.surfaceWhite, borderColor: c.outlineVariant }]}>
      <View style={styles.header}>
        <Skeleton width={24} height={24} radius={radii.full} />
        <Skeleton width="60%" height={16} />
      </View>
      <Skeleton width="90%" height={13} />
      <Skeleton width="70%" height={13} />
      <View style={styles.meta}>
        <Skeleton width={60} height={20} radius={radii.full} />
        <Skeleton width={36} height={12} />
        <Skeleton width={36} height={12} />
      </View>
    </View>
  );
}

export function RepoListSkeleton() {
  return (
    <View testID="repo-list-skeleton" style={styles.wrapper}>
      {Array.from({ length: 6 }).map((_, i) => (
        <RepoCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: spacing.containerMargin, paddingTop: spacing.md, flex: 1 },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.gutterMd,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.gutterMd },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
    marginTop: spacing.gutterSm,
  },
});
