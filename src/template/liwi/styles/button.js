import { liwiColors } from '../../../utils/constants';
import variables from '../variables/material';

export default {
  'NativeBase.Button': {
    '.btnLiwi': {
      height: 70,
      backgroundColor: '#ff31d0',
      borderRadius: 35,
    },
    '.w50': {
      flex: 1,
      flexDirection: 'row',
      flexGrow: 1,
      justifyContent: 'center',
    },
    '.red': {
      backgroundColor: liwiColors.redColor,
      color: '#fff',
    },
    '.blue': {
      backgroundColor: '#337aff',
      color: '#fff',
    },
    '.success': {
      backgroundColor: variables.brandSuccess,
      color: '#fff',
    },
    '.iconMenu': {
      padding: 0,
      marginLeft: 16,
      marginRight: 0,
      marginTop: 5,
      borderWidth: 0,
      borderRadius: 0,
      paddingLeft: 0,
      backgroundColor: 'none',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0,
      elevation: 0,
    },
    '.backIconMenu': {
      padding: 0,
      marginLeft: -20,
      marginRight: 12,
      marginTop: 5,
      borderWidth: 0,
      borderRadius: 0,
      paddingLeft: 0,
      backgroundColor: 'none',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0,
      elevation: 0,
    },
    '.activeStyle': {
      backgroundColor: liwiColors.greenColor,
    },

    '.btnDrawer': {
      height: 50,
      margin: 0,
      backgroundColor: 'none',
      borderWidth: 0,
      borderRadius: 0,
      marginTop: 5,
      marginBottom: 5,
    },
    '.marginIcon': {
      marginBottom: 15,
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

    '.split': {
      flex: 0.5,
      justifyContent: 'center',
    },
    borderRadius: 0,
    // All button is affected
    margin: 5,
  },
};
