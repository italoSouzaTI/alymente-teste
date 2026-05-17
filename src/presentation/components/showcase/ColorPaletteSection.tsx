import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../theme/useColors';
import { spacing } from '../ds/tokens';
import { ColorSwatch } from './ColorSwatch';
import { ShowcaseSection } from './ShowcaseSection';

export function ColorPaletteSection() {
  const c = useColors();

  const swatches = [
    { name: 'Primary', value: c.primaryAction },
    { name: 'Surface', value: c.surface },
    { name: 'Container', value: c.surfaceContainer },
    { name: 'Outline', value: c.outline },
    { name: 'Success', value: c.successAction },
    { name: 'Error', value: c.error },
    { name: 'Warning', value: c.warning },
    { name: 'OnSurface', value: c.onSurface },
  ];

  return (
    <ShowcaseSection title="CORES">
      <View style={styles.grid}>
        {swatches.map((s) => (
          <ColorSwatch key={s.name} name={s.name} value={s.value} />
        ))}
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
