import { StyleSheet } from 'react-native';
import { liwiColors, screenWidth } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },

  height: {
    height: 200,
  },

  lottie: {
    height: 200,
    alignSelf: 'center',
    marginBottom: 100,
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
