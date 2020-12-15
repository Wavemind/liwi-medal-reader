import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../../utils/constants';

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
  marginTop30: { marginTop: 30 },
  rowStyle: { marginTop: 10, marginBottom: 10 },
  customContainer: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  customText: { backgroundColor: liwiColors.whiteColor, padding: 15, flex: 1 },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: liwiColors.whiteColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  iconInfo: { color: liwiColors.redColor },
  touchable: {
    marginRight: 7,
  },
});
