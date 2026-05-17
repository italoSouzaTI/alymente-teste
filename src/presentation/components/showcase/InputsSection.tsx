import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MagnifyingGlassIcon, XCircleIcon } from 'phosphor-react-native';
import { useColors } from '../../theme/useColors';
import { spacing } from '../ds/tokens';
import { Input } from '../ds/Input';
import { ShowcaseSection } from './ShowcaseSection';

export function InputsSection() {
  const c = useColors();
  const [query, setQuery] = useState('');

  return (
    <ShowcaseSection title="INPUTS">
      <View style={styles.col}>
        <Input placeholder="Input simples..." />
        <Input
          placeholder="Buscar repositório..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<MagnifyingGlassIcon size={18} color={c.outline} />}
          rightIcon={
            query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <XCircleIcon size={18} color={c.outline} weight="fill" />
              </Pressable>
            ) : undefined
          }
        />
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  col: { gap: spacing.sm },
});
