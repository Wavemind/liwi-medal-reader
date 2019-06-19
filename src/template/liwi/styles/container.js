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
    '.round': {
      borderRadius: 50,
      backgroundColor: liwiColors.darkGreyColor,
      height: 40,
      width: 40,
      flex: 1,
      flexGrow: 1,
    },
    '.flex-child': {
      flexGrow: 1, // not used actually
    },
    '.margin-auto': {
      margin: marginIsTablet(),
    },
    '.w50': {
      flex: 1,
      flexDirection: 'row',
    },
    '.padding-auto': { padding: 20 },
    '.flex-center': {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      flex: 1,
      flexGrow: 1,
    },
    '.flex-center-stretch': {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      flexGrow: 1,
    },
    '.full-space': {
      flexDirection: 'column',
      justifyContent: 'center',
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

    '.bottom-view': {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 36
    },

    '.flex': {
      flex: 1
    }
  },
};
