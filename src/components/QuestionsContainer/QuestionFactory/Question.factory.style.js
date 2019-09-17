import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  priority: {
    backgroundColor: '#d8d8d8',
  },
  button: {
    backgroundColor: liwiColors.redColor,
    borderColor: liwiColors.redColor,
    borderWidth: 1,
    borderRadius: 32,
    width: 50,
    height: 50,
  },
  iconInfo: { color: liwiColors.redColor },
  triage: {
    elevation: 2,
  },
  normal: {},
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
  },
  icon: {
    fontSize: 18,
    color: liwiColors.whiteColor,
  },
  category: {
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
  },
  condensed: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 0,
    paddingLeft: 0,
  },
});
