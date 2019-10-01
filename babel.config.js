module.exports = function(api) {
  api.cache(true);
  const presets = [
    '@babel/preset-react',
    'module:metro-react-native-babel-preset',
  ];
  const plugins = [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.ios.js', '.android.js'],
        alias: {
          test: './test',
          underscore: 'lodash',
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
    sourceMaps: true,
    // production: {
    //   plugins: ['transform-remove-console'],
    // },
  };
};
