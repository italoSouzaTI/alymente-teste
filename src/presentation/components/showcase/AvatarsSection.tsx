import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../ds/tokens';
import { Avatar } from '../ds/Avatar';
import { Text } from '../ds/Text';
import { ShowcaseSection } from './ShowcaseSection';

const DEMO_URI = 'https://avatars.githubusercontent.com/u/9919?s=200&v=4';

export function AvatarsSection() {
  return (
    <ShowcaseSection title="AVATARES">
      <View style={styles.row}>
        <View style={styles.cell}>
          <Avatar uri={DEMO_URI} size="xs" />
          <Text variant="labelSm" color="muted">
            xs
          </Text>
        </View>
        <View style={styles.cell}>
          <Avatar uri={DEMO_URI} size="sm" />
          <Text variant="labelSm" color="muted">
            sm
          </Text>
        </View>
        <View style={styles.cell}>
          <Avatar uri={DEMO_URI} size="md" />
          <Text variant="labelSm" color="muted">
            md
          </Text>
        </View>
        <View style={styles.cell}>
          <Avatar uri={DEMO_URI} size="lg" />
          <Text variant="labelSm" color="muted">
            lg
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Avatar initials="GH" size="xs" />
          <Text variant="labelSm" color="muted">
            fallback xs
          </Text>
        </View>
        <View style={styles.cell}>
          <Avatar initials="GH" size="sm" />
          <Text variant="labelSm" color="muted">
            sm
          </Text>
        </View>
        <View style={styles.cell}>
          <Avatar initials="GH" size="md" />
          <Text variant="labelSm" color="muted">
            md
          </Text>
        </View>
        <View style={styles.cell}>
          <Avatar initials="GH" size="lg" />
          <Text variant="labelSm" color="muted">
            lg
          </Text>
        </View>
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.lg,
    flexWrap: 'wrap',
  },
  cell: {
    alignItems: 'center',
    gap: spacing.gutterSm,
  },
});
