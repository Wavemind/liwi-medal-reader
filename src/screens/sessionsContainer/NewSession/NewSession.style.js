import {StyleSheet} from 'react-native';
import {
  liwiColors, paddingIsTablet,
  screenHeight,
  screenWidth,
} from '../../../utils/constants';

export const styles = StyleSheet.create({

  container: {
    flexDirection: 'column',
    flex: 1
  },
  content: {
    // flexBasis: screenWidth / 2,
    flexGrow: 1,
    // width: screenWidth * 0.8,
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
    // padding: paddingIsTablet(),
    // marginTop: screenHeight * 0.27,
    // marginBottom: 50,
  },
  marginTop: {
    // marginTop: 20
  },

  height: {
    height: 200,
  },
});
