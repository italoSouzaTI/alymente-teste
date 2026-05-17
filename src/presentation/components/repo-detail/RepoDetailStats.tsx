import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Repo } from '../../../domain/entities/Repo';
import { spacing } from '../ds/tokens';
import { StatCard } from './StatCard';

interface RepoDetailStatsProps {
  repo: Repo;
}

export function RepoDetailStats({ repo }: RepoDetailStatsProps) {
  return (
    <View style={styles.row}>
      <StatCard icon="⭐" value={repo.stars} label="Stars" />
      <StatCard icon="🍴" value={repo.forks} label="Forks" />
      <StatCard icon="👁️" value={repo.watchers} label="Watchers" />
      <StatCard icon="🐛" value={repo.openIssuesCount} label="Issues" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.containerMargin,
  },
});
