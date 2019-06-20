import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  priority: {
    backgroundColor: '#d8d8d8',
  },
  mandatory: {
    // borderWidth: 1,
    // borderColor: '#ffa4b5',
  },
  triage: {
    elevation: 2,
  },
  normal: {},
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
  },
  icon: {
    color: liwiColors.redColor,
  },
  category: {
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
  },
});
