import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type {
  RepoDetailScreenProps,
  ExploreNavigationProp,
} from '../../infrastructure/navigation/types';
import { useRepoDetailViewModel } from '../viewmodels/useRepoDetailViewModel';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  RepoDetailActions,
  RepoDetailHeader,
  RepoDetailLayout,
  RepoDetailStats,
} from '../components/repo-detail';

export function RepoDetailScreen({ route }: RepoDetailScreenProps) {
  const { owner, repo, repoName } = route.params;
  const [state, actions] = useRepoDetailViewModel(owner, repo);
  const navigation = useNavigation<ExploreNavigationProp>();

  const handleViewIssues = useCallback(() => {
    navigation.navigate('Issues', { owner, repo, repoName });
  }, [navigation, owner, repo, repoName]);

  if (state.isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (state.error != null || state.repo == null) {
    return (
      <ErrorState message={state.error ?? 'Repositório não encontrado.'} onRetry={actions.retry} />
    );
  }

  return (
    <RepoDetailLayout>
      <RepoDetailHeader repo={state.repo} />
      <RepoDetailStats repo={state.repo} />
      <RepoDetailActions issueCount={state.repo.openIssuesCount} onViewIssues={handleViewIssues} />
    </RepoDetailLayout>
  );
}
