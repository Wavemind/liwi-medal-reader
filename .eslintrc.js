module.exports = {
  root: true,
  extends: ['@react-native-community'],
  rules: {
    semi: ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'react-hooks/exhaustive-deps': 0,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
}
