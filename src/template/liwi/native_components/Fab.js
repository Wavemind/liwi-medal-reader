// @flow

import variable from '../variables/platform';

// eslint-disable-next-line no-unused-vars
export default (variables /*: * */ = variable) => {
  const fabTheme = {
    'NativeBase.Button': {
      alignItems: 'center',
      padding: null,
      justifyContent: 'center',
      'NativeBase.Icon': {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 0,
        marginRight: 0,
      },
      'NativeBase.IconNB': {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 0,
        marginRight: 0,
      },
    },
  };

  return fabTheme;
};
