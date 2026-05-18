import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '@theme/useColors';
import { radii } from '@ds/tokens';

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  radius?: number;
}

export function Skeleton({ width, height, radius = radii.md }: SkeletonProps) {
  const c = useColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [c.surfaceContainer, c.surfaceContainerHigh],
    ),
  }));

  return <Animated.View style={[{ width, height, borderRadius: radius }, animatedStyle]} />;
}
