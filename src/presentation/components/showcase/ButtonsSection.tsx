import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../ds/tokens';
import { Button } from '../ds/Button';
import { Text } from '../ds/Text';
import { ShowcaseSection } from './ShowcaseSection';

export function ButtonsSection() {
  return (
    <ShowcaseSection title="BOTÕES">
      <View style={styles.row}>
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
      </View>
      <View style={styles.row}>
        <Button label="Success" variant="success" />
        <Button label="Ghost" variant="ghost" />
      </View>
      <View style={styles.row}>
        <Button label="SM" size="sm" />
        <Button label="MD" size="md" />
        <Button label="LG" size="lg" />
      </View>
      <View style={styles.row}>
        <Button label="Loading" loading />
        <Button label="Disabled" disabled />
      </View>
      <Button label="Full Width" fullWidth />
      <Text variant="labelSm" color="muted">
        Variantes: primary · secondary · success · ghost — Tamanhos: sm · md · lg
      </Text>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
