import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  redIcon: {
    color: liwiColors.redColor,
  },
  greenIcon: {
    color: liwiColors.greenColor,
  },
  grayIcon: {
    color: liwiColors.darkerGreyColor,
  },
  selectColor: { color: '#CCC' },
  customContent: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  flex: { flex: 1 },
  width50: { width: 50, marginTop: 0, height: '100%' },
  customItem: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  iconSize: { fontSize: 18 },
  noMarginTop: { marginTop: 0 },
  additionalText: { backgroundColor: liwiColors.whiteColor, padding: 15, marginBottom: 5 },
  marginTop30: { marginTop: 30 },
  rowStyle: { marginTop: 10, marginBottom: 10 },
  customContainer: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  customText: { backgroundColor: liwiColors.whiteColor, padding: 15, flex: 1 },
});
