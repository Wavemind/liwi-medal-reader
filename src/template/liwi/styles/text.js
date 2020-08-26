import { liwiColors } from "utils/constants";
import { responsiveUi } from "../../../utils/constants";

export default {
  'NativeBase.H2': {
    '.padding': {
      padding: 20,
    },
  },
  'NativeBase.Text': {
    '.drawerCategorieText': { textAlign: 'center', textTransform: 'uppercase', fontSize: 18 },
    '.drawerItemText': {
      fontSize: 15,
      padding: 0,
      margin: 0,
      color: liwiColors.darkerGreyColor,
    },
    '.italic': { fontStyle: 'italic' },
    '.light': {
      color: '#6a6a6a',
      borderRadius: 35,
    },
    '.white': {
      color: liwiColors.whiteColor,
    },
    '.right': {
      textAlign: 'right',
    },
    '.error': {
      color: liwiColors.redColor,
    },
    '.bold': {
      fontWeight: 'bold',
    },
    '.padded': {
      paddingLeft: 18,
      paddingTop: 5,
      paddingBottom: 5,
      paddingRight: 5,
    },
    '.dark': {
      color: '#292829',
    },
    '.size-auto': {
      fontSize: responsiveUi.textFontSize(),
    },
    '.center': {
      textAlign: 'center',
      alignSelf: 'center',
      textAlignVertical: 'center',
    },
    '.left': {
      textAlign: 'left',
      alignSelf: 'start',
      textAlignVertical: 'start',
    },
    '.not-available': {
      marginRight: 80,
      marginLeft: 40,
      paddingLeft: 40,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    '.customTitle': {
      color: liwiColors.redColor,
      fontSize: 20,
      margin: 10,
      marginLeft: 0,
    },
    '.customTitle2': {
      color: liwiColors.redColor,
      fontSize: 16,
      padding: 10,
      margin: 10,
      marginLeft: 0,
    },
    '.bigTitle': {
      color: liwiColors.redColor,
      fontSize: 30,
      padding: 20,
      margin: 20,
      marginLeft: 0,
    },
    '.customSubTitle': {
      fontSize: 20,
      paddingBottom: 5,
      paddingTop: 5,
      fontFamily: 'Roboto-Bold',
    },
    '.smallTitle': {
      color: liwiColors.redColor,
    },
    '.subText': {
      color: liwiColors.redColor,
      fontSize: 26,
      padding: 10,
      borderWidth: 1,
      borderColor: liwiColors.darkGreyColor,
      margin: 10,
    },
  },
};
