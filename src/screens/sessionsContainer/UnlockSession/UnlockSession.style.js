import { Dimensions, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
