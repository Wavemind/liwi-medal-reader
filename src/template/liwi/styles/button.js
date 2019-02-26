import { liwiColors } from '../../../utils/constants';

export default {
  'NativeBase.Button': {
    '.btnLiwi': {
      height: 70,
      backgroundColor: '#ff31d0',
      borderRadius: 35,
    },
    '.blue': {
      backgroundColor: '#337aff',
      color: '#fff',
    },
    '.iconMenu': {
      padding: 0,
      marginTop: 5,
      borderWidth: 0,
      borderRadius: 0,
      paddingLeft: 0,
      backgroundColor: 'none',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0,
      elevation: 0,
    },
    '.btnDrawer': {
      height: 50,
      margin: 0,
      backgroundColor: 'none',
      borderWidth: 0,
      borderRadius: 0,
    },
    '.square': {
      backgroundColor: 'none',
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 1,
      elevation: 1,
      padding: 0,
      margin: 0,
      borderColor: liwiColors.blackColor,
    },
    // Tous les buttons sont affectés !
    margin: 5,
  },
};
