import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  bottomMargin: {
    marginBottom: 20,
  },
  lock: { color: liwiColors.redColor },
  unlock: { color: liwiColors.greenColor },
  marginTop: { marginTop: 15 },
  identifierText: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    fontWeight: 'bold',
    elevation: 1,
  },
  consultationContainer: { flexGrow: 1, alignSelf: 'stretch' },
  patientValues: { flex: 1, alignSelf: 'center', padding: 10, textAlign: 'right', paddingLeft: 20 },
  icons: { marginRight: 15 },
  columnLabel: {
    flex: 1,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: liwiColors.lightGreyColor,
    borderColor: liwiColors.lighterGreyColor,
    borderRadius: 3,
    elevation: 1,
  },

  item: {
    paddingLeft: 10,
    elevation: 1,
    marginRight: 2,
    marginLeft: 2,
    borderWidth: 0,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: liwiColors.whiteDark,
    flexDirection: 'row',
  },

  separator: {
    height: 10,
    width: '100%',
    backgroundColor: 'transparent',
  },

  filterContent: { flexShrink: 1, flexDirection: 'row', paddingBottom: 5 },

  sortButton: { borderRadius: 5, backgroundColor: liwiColors.whiteDark, borderColor: liwiColors.lightGreyColor },

  picker: { borderRadius: 5, color: liwiColors.whiteDark },

  flexDirection: { flexDirection: 'row', flex: 1, flexBasis: '47%' },

  wrapper: { flexDirection: 'row', flexBasis: '50%' },

  footerButton: { margin: 15, paddingLeft: 35, paddingRight: 35, flexShrink: 1},

  patientValuesContainer: { flex: 1, flexDirection: 'column', justifyContent: 'space-between' },

  patientValuesContent: { flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1 },

  flex: { flex: 1 },

  container: { flex: 1, flexDirection: 'column' },

  marginBottom: { marginBottom: 20 },
});
