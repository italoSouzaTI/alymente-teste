import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Bug } from 'phosphor-react-native';
import { useColors } from '../../theme/useColors';
import { Button } from '../ds/Button';
import { Card } from '../ds/Card';
import { Text } from '../ds/Text';
import { spacing } from '../ds/tokens';

interface RepoDetailActionsProps {
  issueCount: number;
  onViewIssues: () => void;
}

export function RepoDetailActions({ issueCount, onViewIssues }: RepoDetailActionsProps) {
  const c = useColors();

  return (
    <View style={styles.wrapper}>
      <Card onPress={issueCount > 0 ? onViewIssues : undefined} style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: c.errorContainer }]}>
            <Bug size={20} color={c.error} weight="fill" />
          </View>
          <View style={styles.info}>
            <Text variant="headlineSm">Issues abertas</Text>
            <Text variant="bodySm" color="muted">
              {issueCount > 0
                ? `${issueCount} issue${issueCount !== 1 ? 's' : ''} aguardando`
                : 'Nenhuma issue aberta'}
            </Text>
          </View>
          {issueCount > 0 && (
            <Text variant="labelMd" color="primary">
              Ver →
            </Text>
          )}
        </View>
      </Card>

      <Button
        label="Ver todas as issues"
        variant="secondary"
        fullWidth
        disabled={issueCount === 0}
        onPress={onViewIssues}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
    paddingHorizontal: spacing.containerMargin,
  },
  card: { padding: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: spacing.gutterSm },
});
