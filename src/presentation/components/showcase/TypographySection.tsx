import React from 'react';
import { View } from 'react-native';
import { useColors } from '@theme/useColors';
import { spacing, type typography } from '@ds/tokens';
import { Text } from '@ds/Text';
import { ShowcaseSection } from './ShowcaseSection';

const SAMPLES: { variant: keyof typeof typography; label: string }[] = [
  { variant: 'headlineLg', label: 'Headline Large — 24 / 600' },
  { variant: 'headlineMd', label: 'Headline Medium — 20 / 600' },
  { variant: 'headlineSm', label: 'Headline Small — 16 / 600' },
  { variant: 'bodyLg', label: 'Body Large — 16 / 400' },
  { variant: 'bodyMd', label: 'Body Medium — 14 / 400' },
  { variant: 'bodySm', label: 'Body Small — 13 / 400' },
  { variant: 'labelMd', label: 'LABEL MEDIUM — 12 / 500' },
  { variant: 'labelSm', label: 'LABEL SMALL — 11 / 500' },
  { variant: 'monoSm', label: 'a1b2c3 mono-sm 12/400' },
];

export function TypographySection() {
  const c = useColors();

  return (
    <ShowcaseSection title="TIPOGRAFIA">
      <View style={{ gap: spacing.sm }}>
        {SAMPLES.map((s) => (
          <View
            key={s.variant}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: c.outlineVariant,
              paddingBottom: spacing.gutterMd,
            }}
          >
            <Text variant={s.variant}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ShowcaseSection>
  );
}
