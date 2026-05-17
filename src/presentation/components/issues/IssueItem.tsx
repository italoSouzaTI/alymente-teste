import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Issue } from '@domain/entities/Issue';
import { useColors } from '@theme/useColors';
import { Avatar } from '@ds/Avatar';
import { Text } from '@ds/Text';
import { radii, spacing, typography } from '@ds/tokens';
import { IssueLabelChip } from './IssueLabelChip';
import { IssueStateIndicator } from './IssueStateIndicator';

interface IssueItemProps {
  issue: Issue;
}

function formatRelativeDate(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) return `${minutes}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 30) return `${days}d atrás`;
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'} atrás`;
  return `${years} ${years === 1 ? 'ano' : 'anos'} atrás`;
}

export function IssueItem({ issue }: IssueItemProps) {
  const c = useColors();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: c.surfaceWhite, borderColor: c.outlineVariant }]}
    >
      <IssueStateIndicator state={issue.state} />

      <View style={styles.content}>
        <Text variant="headlineSm" style={styles.title} numberOfLines={3}>
          {issue.title}
        </Text>

        {issue.labels.length > 0 && (
          <View style={styles.labels}>
            {issue.labels.slice(0, 5).map((label) => (
              <IssueLabelChip key={label.id} label={label} />
            ))}
          </View>
        )}

        <View style={styles.meta}>
          <Text style={styles.number} color="muted">
            #{issue.number}
          </Text>
          <Text variant="labelSm" color="muted">
            {formatRelativeDate(issue.createdAt)}
          </Text>
          <View style={styles.author}>
            <Avatar uri={issue.author.avatarUrl} size="xs" />
            <Text variant="labelSm" color="muted" numberOfLines={1} style={styles.authorName}>
              {issue.author.login}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    gap: spacing.gutterMd,
  },
  title: {
    ...typography.bodyMd,
    fontWeight: '600',
    lineHeight: 20,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutterSm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  number: {
    ...typography.labelSm,
    fontWeight: '600',
    borderRadius: radii.sm,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterSm,
    flex: 1,
  },
  authorName: { flex: 1 },
});
