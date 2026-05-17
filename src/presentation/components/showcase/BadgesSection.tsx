import React from 'react';
import { StyleSheet, View } from 'react-native';
import { languageColors, spacing } from '../ds/tokens';
import { Badge } from '../ds/Badge';
import { ShowcaseSection } from './ShowcaseSection';

export function BadgesSection() {
  return (
    <ShowcaseSection title="BADGES">
      <View style={styles.row}>
        <Badge label="default" variant="default" />
        <Badge label="primary" variant="primary" />
        <Badge label="success" variant="success" />
      </View>
      <View style={styles.row}>
        <Badge label="error" variant="error" />
        <Badge label="warning" variant="warning" />
        <Badge label="outline" variant="outline" />
      </View>
      <View style={styles.row}>
        <Badge label="TypeScript" dot={languageColors.TypeScript} variant="outline" />
        <Badge label="Python" dot={languageColors.Python} variant="outline" />
        <Badge label="Go" dot={languageColors.Go} variant="outline" />
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutterMd,
  },
});
