import { screenWidth } from 'utils/constants';
import { liwiColors } from '../../../utils/constants';

export default {
  'NativeBase.Item': {
    '.round': {
      borderRadius: 5,
      paddingLeft: 10,
      borderWidth: 1,
      borderColor: liwiColors.blackColor,
    }
  },
  'NativeBase.Input': {
    '.login-input': {},
    '.string': {
      width: screenWidth * 0.8,
    },
    '.common': {
      color: liwiColors.blackColor,
      paddingTop: 10,
      paddingLeft: 10,
    },
    '.question': {
      borderColor: liwiColors.greyColor,
      borderWidth: 1,
      width: '100%',
      flex: 1,
      margin: 0,
    },
  },
};
