// @flow

import variable from "../variables/platform";

// eslint-disable-next-line no-unused-vars
export default (variables /* : * */ = variable) => {
  const contentTheme = {
    flex: 1,
    backgroundColor: 'transparent',
    'NativeBase.Segment': {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
  };

  return contentTheme;
};
