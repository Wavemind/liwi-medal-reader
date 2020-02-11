import { StyleSheet } from 'react-native';
import { isTablet, liwiColors, screenWidth } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },

  height: {
    height: 200,
  },

  lottie: {
    height: isTablet ? 200 : 100,
    alignSelf: 'center',

    marginBottom: isTablet ? 100 : 20,
  },

  button: {
    marginTop: 50,
  },

  view: {
    width: screenWidth * 0.8,
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 30,
  },
});
