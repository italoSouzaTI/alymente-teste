import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiSlash } from 'phosphor-react-native';
import { Text } from '@ds/Text';
import { spacing } from '@ds/tokens';
import { useColors } from '@theme/useColors';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const insets = useSafeAreaInsets();
  const c = useColors();

  if (isOnline) return null;

  return (
    <View
      testID="offline-banner"
      style={[
        styles.banner,
        { backgroundColor: c.warningContainer, paddingTop: insets.top + spacing.sm },
      ]}
    >
      <WifiSlash size={16} color={c.warning} weight="bold" />
      <Text style={[styles.text, { color: c.warning }]}>Sem conexão com a internet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.sm,
    gap: spacing.gutterMd,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
