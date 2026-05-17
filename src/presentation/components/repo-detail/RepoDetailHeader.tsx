import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Repo } from '@domain/entities/Repo';
import { useColors } from '@theme/useColors';
import { Avatar } from '@ds/Avatar';
import { Badge } from '@ds/Badge';
import { Text } from '@ds/Text';
import { getLanguageColor, spacing } from '@ds/tokens';

interface RepoDetailHeaderProps {
  repo: Repo;
}

export function RepoDetailHeader({ repo }: RepoDetailHeaderProps) {
  const c = useColors();
  const langColor = repo.language != null ? getLanguageColor(repo.language, c.outline) : undefined;

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: c.surfaceWhite, borderBottomColor: c.outlineVariant },
      ]}
    >
      <View style={styles.owner}>
        <Avatar uri={repo.owner.avatarUrl} initials={repo.owner.login} size="sm" />
        <Text variant="bodyMd" color="muted">
          {repo.owner.login}
        </Text>
      </View>

      <Text variant="headlineLg" style={styles.name} numberOfLines={2}>
        {repo.name}
      </Text>

      {repo.description != null && (
        <Text variant="bodyMd" color="muted" style={styles.description}>
          {repo.description}
        </Text>
      )}

      {repo.language != null && <Badge label={repo.language} dot={langColor} variant="outline" />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterMd,
  },
  name: { marginTop: spacing.gutterSm },
  description: { lineHeight: 22 },
});
