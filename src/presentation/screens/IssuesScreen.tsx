import React from 'react';
import type { IssuesScreenProps } from '@presentation/navigation/types';
import { useIssuesViewModel } from '@viewmodels/useIssuesViewModel';
import { Screen } from '@components/common/Screen';
import { IssueList } from '@components/issues/IssueList';

export function IssuesScreen({ route }: IssuesScreenProps) {
  const { owner, repo } = route.params;
  const [state, actions] = useIssuesViewModel(owner, repo);

  return (
    <Screen>
      <IssueList state={state} actions={actions} />
    </Screen>
  );
}
