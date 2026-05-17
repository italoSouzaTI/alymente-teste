/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^react-native-worklets$': '<rootDir>/node_modules/react-native-worklets/src/mock.ts',
    '^react-native-reanimated$': '<rootDir>/node_modules/react-native-reanimated/mock.js',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@ds$': '<rootDir>/src/presentation/components/ds/index',
    '^@ds/(.*)$': '<rootDir>/src/presentation/components/ds/$1',
    '^@components/(.*)$': '<rootDir>/src/presentation/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/presentation/screens/$1',
    '^@theme/(.*)$': '<rootDir>/src/presentation/theme/$1',
    '^@viewmodels/(.*)$': '<rootDir>/src/presentation/viewmodels/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|phosphor-react-native|@shopify/flash-list|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-worklets)',
  ],
};
