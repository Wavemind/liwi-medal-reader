import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  priority: {
    backgroundColor: '#d8d8d8',
  },
  buttonNav: { flex: 0.5, flexDirection: 'row', flexGrow: 1, justifyContent: 'center', width: 100 },
  blocScreen: { fontSize: 20 },
  marginTop: { marginTop: 25 },
  validation: { alignSelf: 'center' },
  warning: { alignSelf: 'center', color: liwiColors.redColor, fontSize: 25 },
  questions: { marginLeft: 40 },
  stepContainer: { flex: 1 },
  screen: { color: liwiColors.redColor, fontWeight: 'bold', fontSize: 25 },
  stepName: { marginTop: 2, marginLeft: 10, marginRight: 10, fontWeight: 'bold' },
  stepHeaderName: { flex: 1, flexDirection: 'row', marginLeft: 20 },
  hand: { width: 180, alignSelf: 'center' },
  button: {
    backgroundColor: liwiColors.redColor,
    borderColor: liwiColors.redColor,
    borderWidth: 1,
    borderRadius: 32,
    width: 50,
    height: 50,
  },
  iconValid: { color: liwiColors.greenColor },
  iconInValid: { color: liwiColors.redColor },
  triage: {
    elevation: 2,
  },
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
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  unavailable: {
    flex: 1,
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
});
