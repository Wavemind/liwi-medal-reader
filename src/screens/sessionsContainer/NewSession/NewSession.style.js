import { StyleSheet } from 'react-native';
import {
  liwiColors,
  screenHeight,
  screenWidth,
} from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  content: {
    width: screenWidth * 0.8,
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 30,
    marginTop: screenHeight * 0.27,
    marginBottom: 50,
  },

  marginTop: {
    marginTop: 20,
  },

  height: {
    height: 200,
  },
});
