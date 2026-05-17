import { StyleSheet, View } from 'react-native';
import { Text } from '@ds/Text';
import { ThemeSwitch } from '@ds/ThemeSwitch';
import { spacing } from '@ds/tokens';

export function ShowcaseHeader() {
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text variant="headlineLg">Design System</Text>
        <Text variant="bodySm" color="muted">
          Source Velocity · GitHub Explorer
        </Text>
      </View>
      <ThemeSwitch />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titles: { gap: spacing.gutterSm, flex: 1 },
});
