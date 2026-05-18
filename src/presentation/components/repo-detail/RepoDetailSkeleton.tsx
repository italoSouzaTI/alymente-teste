import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@components/common/Skeleton';
import { radii, spacing } from '@ds/tokens';
import { useColors } from '@theme/useColors';

export function RepoDetailSkeleton() {
  const c = useColors();
  return (
    <View testID="repo-detail-skeleton">
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: c.surfaceWhite, borderBottomColor: c.outlineVariant },
        ]}
      >
        <View style={styles.owner}>
          <Skeleton width={32} height={32} radius={radii.full} />
          <Skeleton width={80} height={13} />
        </View>
        <Skeleton width="80%" height={24} />
        <Skeleton width="95%" height={14} />
        <Skeleton width="65%" height={14} />
        <Skeleton width={80} height={22} radius={radii.full} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.statCard,
              { backgroundColor: c.surfaceWhite, borderColor: c.outlineVariant },
            ]}
          >
            <Skeleton width={28} height={28} />
            <Skeleton width={40} height={16} />
            <Skeleton width={50} height={11} />
          </View>
        ))}
      </View>

      {/* Actions block */}
      <View
        style={[styles.actions, { backgroundColor: c.surfaceWhite, borderColor: c.outlineVariant }]}
      >
        <Skeleton width="50%" height={16} />
        <Skeleton width="100%" height={40} radius={radii.lg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  owner: { flexDirection: 'row', alignItems: 'center', gap: spacing.gutterMd },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.gutterSm,
  },
  actions: {
    margin: spacing.containerMargin,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
});
