import { StyleSheet } from 'react-native';
import { liwiColors, responsiveUi } from '../../utils/constants';

export const styles = StyleSheet.create({
  buttonNext: {
    backgroundColor: liwiColors.greenColor,
  },
  pad: {
    padding: responsiveUi.padding(),
  },
  buttonPrev: {
    backgroundColor: liwiColors.redColor,
  },
  icon: {
    fontSize: 18,
    color: liwiColors.whiteColor,
  },
});
