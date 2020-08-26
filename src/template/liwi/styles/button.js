import { liwiColors } from "../../../utils/constants";
import variables from "../variables/material";

export default {
  'NativeBase.Button': {
    '.btnLiwi': {
      height: 70,
      borderRadius: 35,
    },
    '.drawerCategorieButton': {
      flex: 1,
      backgroundColor: liwiColors.greyColor,
      // padding: 20,
      paddingTop: 5,
      paddingBottom: 5,
      marginRight: 5,
      marginLeft: 5,
      marginTop: 15,
      flexShrink: 1,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
      textAlign: 'center',
    },
    '.drawerItemButton': {
      // flex: 1,
      flexDirection: 'row',
      height: 13,
      // justifyContent: 'space-between',
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
      height: 57,
      width: 65,
      padding: 0,
      marginLeft: -5,
      marginTop: 0,
      marginRight: 0,
      borderWidth: 0,
      borderRadius: 2,
      paddingLeft: 0,
      backgroundColor: liwiColors.redColor,
      elevation: 5,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
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
