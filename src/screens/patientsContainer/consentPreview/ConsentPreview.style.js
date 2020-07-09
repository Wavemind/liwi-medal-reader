import { Dimensions, StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: liwiColors.blackColor,
    margin: 0,
    padding: 0,
  },
  documentImage: {
    flex: 1,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 2,
    resizeMode: 'contain',
  },
});
