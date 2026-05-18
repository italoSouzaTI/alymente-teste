import { WarningIcon } from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@theme/useColors';
import { Button } from '@ds/Button';
import { Text } from '@ds/Text';
import { spacing } from '@ds/tokens';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const c = useColors();

  return (
    <View style={styles.wrapper}>
      <WarningIcon size={40} color={c.error} weight="fill" />
      <Text variant="headlineSm" style={styles.center}>
        Algo deu errado
      </Text>
      <Text variant="bodySm" color="muted" style={styles.center}>
        {message}
      </Text>
      {onRetry != null && (
        <Button
          label="Tentar novamente"
          variant="secondary"
          onPress={onRetry}
          style={styles.retryButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  center: { textAlign: 'center' },
  retryButton: { alignSelf: 'center' },
});
