import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  priority: {
    borderColor: liwiColors.redColor,
    borderWidth: 3,
  },
  triage: {
    borderColor: liwiColors.redColor,
    borderWidth: 3,
  },
  normal: {
    borderColor: '#3e3e3e',
    borderWidth: 3,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
  },
  icon: {
    color: liwiColors.redColor,
  },
});
