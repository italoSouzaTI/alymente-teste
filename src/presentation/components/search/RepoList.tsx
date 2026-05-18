import { MagnifyingGlassIcon, TrayIcon } from 'phosphor-react-native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import type { Repo } from '@domain/entities/Repo';
import type { SearchViewState, SearchViewActions } from '@viewmodels/useSearchViewModel';
import { useColors } from '@theme/useColors';
import { spacing } from '@ds/tokens';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useRecentSearches } from '@hooks/useRecentSearches';
import { RepoCard } from '@components/repo/RepoCard';
import { EmptyState } from '@components/common/EmptyState';
import { ErrorState } from '@components/common/ErrorState';
import { SearchResultsHeader } from './SearchResultsHeader';
import { RepoListSkeleton } from './RepoListSkeleton';
import { RepoListFooter } from './RepoListFooter';
import { RecentSearchesList } from './RecentSearchesList';

interface RepoListProps {
  state: SearchViewState;
  actions: SearchViewActions;
  onRepoPress: (repo: Repo) => void;
}

export function RepoList({ state, actions, onRepoPress }: RepoListProps) {
  const c = useColors();
  const isOnline = useOnlineStatus();
  const recentSearches = useRecentSearches();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Repo>) => (
      <View style={styles.item}>
        <RepoCard repo={item} onPress={() => onRepoPress(item)} />
      </View>
    ),
    [onRepoPress],
  );

  const keyExtractor = useCallback((item: Repo) => String(item.id), []);

  if (state.isLoading) {
    return <RepoListSkeleton />;
  }

  if (state.error != null) {
    return <ErrorState message={state.error} onRetry={actions.retry} />;
  }

  if (state.query.trim().length === 0) {
    if (!isOnline && recentSearches.length > 0) {
      return <RecentSearchesList searches={recentSearches} onSelect={actions.setQuery} />;
    }
    return (
      <EmptyState
        icon={MagnifyingGlassIcon}
        title="Encontre repositórios"
        description="Digite o nome de um repositório ou organização para começar."
      />
    );
  }

  if (state.repos.length === 0) {
    return (
      <EmptyState
        icon={TrayIcon}
        title="Nenhum resultado"
        description={`Não encontramos repositórios para "${state.query}".`}
      />
    );
  }

  return (
    <FlashList
      data={state.repos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ backgroundColor: c.background, paddingBottom: spacing.xxl }}
      ListHeaderComponent={
        <SearchResultsHeader totalCount={state.totalCount} query={state.query} />
      }
      ListFooterComponent={
        <RepoListFooter isFetchingMore={state.isFetchingMore} hasNextPage={state.hasNextPage} />
      }
      onEndReached={actions.loadMore}
      onEndReachedThreshold={0.4}
      onRefresh={actions.refresh}
      refreshing={state.isRefreshing}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  item: { paddingHorizontal: spacing.containerMargin },
});
