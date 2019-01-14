import { Dimensions, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {},
});
