import '@testing-library/jest-native/extend-expect';
import type { ReactNode } from 'react';

// Mock global react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
  SafeAreaView: ({ children }: { children: ReactNode }) => children,
  SafeAreaConsumer: ({ children }: { children: (insets: object) => ReactNode }) =>
    children({ top: 0, bottom: 0, left: 0, right: 0 }),
  initialWindowMetrics: {
    frame: { x: 0, y: 0, width: 375, height: 812 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  },
}));

// Mock global @shopify/flash-list — re-exporta como FlatList
jest.mock('@shopify/flash-list', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  return {
    FlashList: (props: object) => React.createElement(FlatList, props),
    MasonryFlashList: (props: object) => React.createElement(FlatList, props),
  };
});
