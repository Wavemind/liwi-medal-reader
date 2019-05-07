import { StyleSheet } from 'react-native';
import { liwiColors, screenWidth } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  height: {
    height: 300,
  },
  content: {
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 30,
  },
  marginTop: {
    marginTop: 20,
  },
});
