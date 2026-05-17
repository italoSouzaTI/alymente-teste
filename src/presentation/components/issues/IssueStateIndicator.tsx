import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GitPullRequest, XCircle } from 'phosphor-react-native';
import { useColors } from '../../theme/useColors';
import { radii, spacing } from '../ds/tokens';

interface IssueStateIndicatorProps {
  state: 'open' | 'closed';
}

export function IssueStateIndicator({ state }: IssueStateIndicatorProps) {
  const c = useColors();
  const isOpen = state === 'open';

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: isOpen ? c.successContainer : c.errorContainer,
        },
      ]}
    >
      {isOpen ? (
        <GitPullRequest size={14} color={isOpen ? c.success : c.error} weight="bold" />
      ) : (
        <XCircle size={14} color={c.error} weight="bold" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 26,
    height: 26,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.gutterSm,
    flexShrink: 0,
  },
});
