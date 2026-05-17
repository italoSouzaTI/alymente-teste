import { BugIcon, EyeIcon, GitForkIcon, StarIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import type { Repo } from '@domain/entities/Repo';
import { spacing } from '@ds/tokens';
import { StatCard } from './StatCard';

interface RepoDetailStatsProps {
  repo: Repo;
}

export function RepoDetailStats({ repo }: RepoDetailStatsProps) {
  return (
    <View style={styles.row}>
      <StatCard icon={StarIcon} value={repo.stars} label="Stars" />
      <StatCard icon={GitForkIcon} value={repo.forks} label="Forks" />
      <StatCard icon={EyeIcon} value={repo.watchers} label="Watchers" />
      <StatCard icon={BugIcon} value={repo.openIssuesCount} label="Issues" />
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
