module.exports = function (api) {
  api.cache(true);
  const presets = ['@babel/preset-react', 'module:metro-react-native-babel-preset'];
  const plugins = [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    [
      'dotenv-import',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: false,
      },
    ],
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
  };
};
