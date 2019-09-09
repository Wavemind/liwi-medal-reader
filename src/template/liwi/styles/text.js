import { liwiColors } from 'utils/constants';
import { fontSizeTextIsTablet } from '../../../utils/constants';

export default {
  'NativeBase.H2': {
    '.padding': {
      padding: 20,
    },
  },
  'NativeBase.Text': {
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
      fontSize: fontSizeTextIsTablet(),
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
      borderWidth: 1,
      borderColor: liwiColors.darkGreyColor,
      margin: 10,
    },
  },
};
