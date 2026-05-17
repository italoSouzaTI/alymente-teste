import { GitForkIcon, StarIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import type { Repo } from '@domain/entities/Repo';
import { useColors } from '@theme/useColors';
import { Avatar, Badge, Card, Text, getLanguageColor, spacing, typography } from '@ds';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface RepoCardProps {
  repo: Repo;
  onPress?: () => void;
}

export function RepoCard({ repo, onPress }: RepoCardProps) {
  const c = useColors();
  const langColor = repo.language != null ? getLanguageColor(repo.language, c.outline) : undefined;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={repo.owner.avatarUrl} initials={repo.owner.login} size="xs" />
        <Text variant="headlineSm" style={styles.name} numberOfLines={1}>
          {repo.fullName}
        </Text>
      </View>

      {repo.description != null && (
        <Text variant="bodySm" color="muted" style={styles.description} numberOfLines={2}>
          {repo.description}
        </Text>
      )}

      <View style={styles.meta}>
        {repo.language != null && <Badge label={repo.language} dot={langColor} variant="outline" />}
        <View style={styles.stat}>
          <StarIcon size={12} color={c.onSurfaceVariant} weight="fill" />
          <Text variant="labelMd" color="muted">
            {formatCount(repo.stars)}
          </Text>
        </View>
        <View style={styles.stat}>
          <GitForkIcon size={12} color={c.onSurfaceVariant} weight="fill" />
          <Text variant="labelMd" color="muted">
            {formatCount(repo.forks)}
          </Text>
        </View>
        {repo.openIssuesCount > 0 && (
          <Text variant="labelMd" color="muted">
            ● {repo.openIssuesCount} issues
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
    marginBottom: spacing.gutterMd,
  },
  name: { flex: 1 },
  description: { marginBottom: spacing.sm, ...typography.bodySm },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
    flexWrap: 'wrap',
    marginTop: spacing.gutterSm,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: spacing.gutterSm },
});
