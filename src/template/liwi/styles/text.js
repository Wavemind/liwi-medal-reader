import { liwiColors } from 'utils/constants';
import { responsiveUi } from '../../../utils/constants';

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
    '.light': {
      color: '#6a6a6a',
      borderRadius: 35,
    },
    '.white': {
      color: liwiColors.whiteColor,
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
      textAlignVertical: 'center',
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
      fontSize: 26,
      padding: 10,
      margin: 10,
      marginLeft: 0,
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
