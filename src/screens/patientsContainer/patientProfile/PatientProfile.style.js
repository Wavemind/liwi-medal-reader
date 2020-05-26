import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  bottomMargin: {
    marginBottom: 20,
  },
  lock: { color: liwiColors.redColor },
  unlock: { color: liwiColors.greenColor },

  identifierText: {
    flex: 0.3,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: liwiColors.whiteDark,
    borderColor: liwiColors.lightGreyColor,
    borderRadius: 3,
    elevation: 1,
  },

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
    borderRadius: 4,
    height: 80,
    marginRight: 2,
    marginLeft: 2,
    borderWidth: 0,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: liwiColors.whiteDark,
  },

  separator: {
    height: 3,
    width: '100%',
    backgroundColor: liwiColors.lighterGreyColor,
  },

  filterContent: { flexDirection: 'row', paddingBottom: 5 },

  sortButton: { borderRadius: 5, backgroundColor: liwiColors.whiteDark, borderColor: liwiColors.lightGreyColor },

  flatList: { paddingBottom: 220 },

  picker: { borderRadius: 5, color: liwiColors.whiteDark },

  flexDirection: { flexDirection: 'row' },

  patientValues: { flex: 0.7, alignSelf: 'center', paddingLeft: 20 },

  footerButton: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
