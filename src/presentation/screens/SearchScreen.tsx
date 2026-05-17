import React, { useCallback } from 'react';
import type { ExploreNavigationProp, SearchScreenProps } from '@infrastructure/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { Repo } from '@domain/entities/Repo';
import { useSearchViewModel } from '@viewmodels/useSearchViewModel';
import { Screen } from '@components/common/Screen';
import { SearchBar } from '@components/search/SearchBar';
import { RepoList } from '@components/search/RepoList';

export function SearchScreen(_props: SearchScreenProps) {
  const [state, actions] = useSearchViewModel();
  const navigation = useNavigation<ExploreNavigationProp>();

  const handleRepoPress = useCallback(
    (repo: Repo) => {
      navigation.navigate('RepoDetail', {
        owner: repo.owner.login,
        repo: repo.name,
        repoName: repo.fullName,
      });
    },
    [navigation],
  );

  return (
    <Screen>
      <SearchBar value={state.query} onChangeText={actions.setQuery} />
      <RepoList state={state} actions={actions} onRepoPress={handleRepoPress} />
    </Screen>
  );
}
