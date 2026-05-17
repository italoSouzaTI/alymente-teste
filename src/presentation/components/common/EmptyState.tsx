import type { Icon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@theme/useColors';
import { Text } from '@ds/Text';
import { spacing } from '@ds/tokens';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: IconComponent, title, description }: EmptyStateProps) {
  const c = useColors();

  return (
    <View style={styles.wrapper}>
      <IconComponent size={48} color={c.onSurfaceVariant} weight="fill" />
      <Text variant="headlineSm" style={styles.center}>
        {title}
      </Text>
      {description != null && (
        <Text variant="bodySm" color="muted" style={styles.center}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  center: { textAlign: 'center' },
});
