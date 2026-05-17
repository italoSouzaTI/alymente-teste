import { CheckCircleIcon } from 'phosphor-react-native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import type { Issue } from '@domain/entities/Issue';
import type { IssuesViewState, IssuesViewActions } from '@viewmodels/useIssuesViewModel';
import { useColors } from '@theme/useColors';
import { EmptyState } from '@components/common/EmptyState';
import { ErrorState } from '@components/common/ErrorState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { RepoListFooter } from '@components/search/RepoListFooter';
import { IssueItem } from './IssueItem';

interface IssueListProps {
  state: IssuesViewState;
  actions: IssuesViewActions;
}

export function IssueList({ state, actions }: IssueListProps) {
  const c = useColors();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Issue>) => <IssueItem issue={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Issue) => String(item.id), []);

  if (state.isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (state.error != null) {
    return <ErrorState message={state.error} onRetry={actions.retry} />;
  }

  if (state.issues.length === 0) {
    return (
      <EmptyState
        icon={CheckCircleIcon}
        title="Sem issues abertas"
        description="Este repositório não tem issues abertas no momento."
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlashList
        data={state.issues}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ backgroundColor: c.background }}
        ListFooterComponent={
          <RepoListFooter isFetchingMore={state.isFetchingMore} hasNextPage={state.hasNextPage} />
        }
        onEndReached={actions.loadMore}
        onEndReachedThreshold={0.4}
        onRefresh={actions.refresh}
        refreshing={state.isRefreshing}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
