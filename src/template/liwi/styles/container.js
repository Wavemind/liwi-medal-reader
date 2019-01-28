import { screenWidth } from '../../../utils/constants';

export default {
  'NativeBase.View': {
    '.root': {
      padding: 20,
      flex: 1,
      backgroundColor: 'blue',
    },
    '.card': {
      width: screenWidth - 40,
      padding: 20,
      flex: 1,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
  },
};
