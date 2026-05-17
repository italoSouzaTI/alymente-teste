import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../theme/useColors';
import { spacing } from '../ds/tokens';

interface ShowcaseLayoutProps {
  children: React.ReactNode;
}

export function ShowcaseLayout({ children }: ShowcaseLayoutProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.containerMargin,
        paddingTop: spacing.lg,
        paddingBottom: insets.bottom + spacing.xxl,
        gap: spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
