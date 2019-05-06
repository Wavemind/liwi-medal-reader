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

  view: {
    width: screenWidth * 0.8,
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 30,
  },
});
