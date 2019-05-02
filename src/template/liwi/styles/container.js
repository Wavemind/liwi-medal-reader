import { liwiColors, marginIsTablet, screenWidth } from '../../../utils/constants';

export default {
  'NativeBase.ViewNB': {
    '.flex-container-column': {
      flexDirection: 'column',
      flex: 1,
    },
    '.flex-container-row': {
      flexDirection: 'row',
      flex: 1,
    },
    '.flex-child': {
      flexGrow: 1, // not used actually
    },
    '.margin-auto': {
      margin: marginIsTablet()
    },
    '.padding-auto': { padding: 20 },
    '.flex-center': {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      flexGrow: 1,
    },
    '.border-primary': {
      borderColor: liwiColors.redColor,
      borderWidth: 2,
      borderRadius: 10,
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
