import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e9e9e9',
    padding: 20,
    height: 80,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  end: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  icon: {
    color: liwiColors.redColor,
  },
});
