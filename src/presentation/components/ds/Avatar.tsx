import React from 'react';
import { Image, View } from 'react-native';
import { useColors } from '@theme/useColors';
import { Text } from './Text';

type Size = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: Size;
}

const sizeMap: Record<Size, number> = { xs: 20, sm: 28, md: 36, lg: 48 };

export function Avatar({ uri, initials, size = 'md' }: AvatarProps) {
  const c = useColors();
  const dim = sizeMap[size];
  const fontSize = Math.round(dim / 2.5);
  const borderRadius = dim / 2;

  if (uri != null) {
    return <Image source={{ uri }} style={{ width: dim, height: dim, borderRadius }} />;
  }

  return (
    <View
      style={{
        width: dim,
        height: dim,
        borderRadius,
        backgroundColor: c.primaryAction,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize, fontWeight: '600', color: c.onPrimary, lineHeight: fontSize * 1.2 }}>
        {(initials ?? '?').slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}
