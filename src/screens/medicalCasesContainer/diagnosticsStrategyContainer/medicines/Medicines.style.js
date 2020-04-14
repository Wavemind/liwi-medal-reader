import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  label: { backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, padding: 4, borderRadius: 2, paddingLeft: 20, marginBottom: 20 },
  viewBox: { marginBottom: 20 },
  viewitem: { flex: 1, flexDirection: 'row', marginBottom: 5 },
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
  additionalText: {
    backgroundColor: liwiColors.redColor,
    color: liwiColors.whiteColor,
    padding: 4,
    borderRadius: 2,
    paddingLeft: 20,
    marginBottom: 20,
  },
});
