import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@theme/useColors';
import { radii } from './tokens';

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;
const THUMB_OFF = 3;
const THUMB_ON = TRACK_WIDTH - THUMB_SIZE - 3;
const DURATION = 220;
const EASING = Easing.out(Easing.quad);

interface SwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accessibilityLabel?: string;
}

export function Switch({ value, onValueChange, accessibilityLabel }: SwitchProps) {
  const c = useColors();

  // Shared values para posição e cores — garante reatividade na UI thread
  const thumbPos = useSharedValue(value ? THUMB_ON : THUMB_OFF);
  const progress = useSharedValue(value ? 1 : 0);
  const offColor = useSharedValue(c.surfaceContainerHigh);
  const onColor = useSharedValue(c.primaryAction);

  // Animar posição do thumb quando value muda
  useEffect(() => {
    thumbPos.value = withTiming(value ? THUMB_ON : THUMB_OFF, {
      duration: DURATION,
      easing: EASING,
    });
    progress.value = withTiming(value ? 1 : 0, { duration: DURATION, easing: EASING });
  }, [value, thumbPos, progress]);

  // Atualizar cores quando o tema muda — evita cores obsoletas no worklet
  useEffect(() => {
    offColor.value = c.surfaceContainerHigh;
    onColor.value = c.primaryAction;
  }, [c.surfaceContainerHigh, c.primaryAction, offColor, onColor]);

  // Cor do track derivada de progress + paleta atual
  const trackBg = useDerivedValue(() =>
    interpolateColor(progress.value, [0, 1], [offColor.value, onColor.value]),
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: trackBg.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPos.value }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radii.full,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
});
