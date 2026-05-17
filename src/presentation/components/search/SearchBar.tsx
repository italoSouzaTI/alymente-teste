import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MagnifyingGlass, XCircle } from 'phosphor-react-native';
import { useColors } from '../../theme/useColors';
import { Input } from '../ds/Input';
import { spacing } from '../ds/tokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const c = useColors();

  return (
    <View style={styles.wrapper}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar repositório..."
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        leftIcon={<MagnifyingGlass size={18} color={c.outline} />}
        rightIcon={
          value.length > 0 ? (
            <Pressable onPress={() => onChangeText('')} hitSlop={8}>
              <XCircle size={18} color={c.outline} weight="fill" />
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.containerMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.gutterMd,
  },
});
