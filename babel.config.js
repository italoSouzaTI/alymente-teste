module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          alias: {
            '@domain': './src/domain',
            '@application': './src/application',
            '@infrastructure': './src/infrastructure',
            '@presentation': './src/presentation',
            '@ds': './src/presentation/components/ds',
            '@components': './src/presentation/components',
            '@screens': './src/presentation/screens',
            '@theme': './src/presentation/theme',
            '@viewmodels': './src/presentation/viewmodels',
            '@hooks': './src/presentation/hooks',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
