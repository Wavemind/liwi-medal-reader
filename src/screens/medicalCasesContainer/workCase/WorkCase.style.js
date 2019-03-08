import { StyleSheet } from 'react-native';
import { liwiColors, screenHeight } from '../../../utils/constants';

export const styles = StyleSheet.create({

  container: {
    height: screenHeight,
    paddingBottom: 80,
  },

  view: {
    padding: 20,
  },

  flex: {
    flex: 1,
  },

  diseases: {
    margin: 10,
    padding: 20,
    backgroundColor: liwiColors.greyColor,
  },

});
