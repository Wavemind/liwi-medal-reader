import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  label: { backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, fontSize: 20, padding: 4, borderRadius: 2, paddingLeft: 10, marginBottom: 10 },
  viewBox: { marginBottom: 20 },
  viewItem: { flex: 1, flexDirection: 'row', marginBottom: 5, backgroundColor: liwiColors.whiteColor, padding: 10 },
  flex50: { flex: 0.5 },
  box: {
    width: 150,
    borderRadius: 3,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: liwiColors.whiteColor,
  },
  icon: { color: liwiColors.redColor, marginLeft: 5 },
  text: { width: 150, padding: 5, fontSize: 18 },
  searchInputStyle: { color: '#CCC' },
  noRightMargin: { marginRight: 0 },
  noTopMargin: { marginTop: 0 },
  rowStyle: { marginTop: 10, marginBottom: 10 },
  additionalText: { backgroundColor: liwiColors.whiteColor, padding: 15, marginBottom: 5 },
});
