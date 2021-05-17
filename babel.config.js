const presets = ['module:metro-react-native-babel-preset']
const plugins = ['@babel/plugin-proposal-decorators', { legacy: true }]

plugins.push([
  'module-resolver',
  {
    root: ['./src'],
    extensions: ['.js', '.json'],
    alias: {
      '@': './src',
      frontend: './frontend_service',
    },
  },
])

module.exports = {
  presets,
  plugins,
}
