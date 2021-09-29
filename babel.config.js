const presets = ['module:metro-react-native-babel-preset']
const plugins = [['@babel/plugin-proposal-decorators', { legacy: true }]]

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

plugins.push([
  'module:react-native-dotenv',
  {
    moduleName: 'env',
    path: '.env',
    blocklist: null,
    allowlist: null,
    blacklist: null,
    whitelist: null,
    safe: false,
    allowUndefined: true,
    verbose: false,
  },
])

module.exports = {
  presets,
  plugins,
}
