import { liwiColors } from 'utils/constants';
import { fontSizeTextIsTablet } from '../../../utils/constants';

export default {
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
    '.not-available': {
      marginRight: 80,
      marginLeft: 40,
      paddingLeft: 40,
      textTransform: 'uppercase',
      textAlign: 'center',
    },

    '.center': {
      textAlign: 'center',
    },
  },
};
