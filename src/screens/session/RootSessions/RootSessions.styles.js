import { Dimensions, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  contentLogo: {
    alignItems: 'center',
  },
  backgroundImage: {
    width: screenWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 100,
  },
});
