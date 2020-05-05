import { StyleSheet } from "react-native";
import { liwiColors } from "../../../../utils/constants";

export const styles = StyleSheet.create({
  container: {},
  blocDrug: { flexDirection: 'row', marginBottom: 8, marginTop: 8 },
  flex: { flex: 0.5 },
  select: { flexDirection: 'row', flex: 0.5, height: 50 },
  picker: { flex: 1, backgroundColor: liwiColors.whiteColor, padding: 5 },
  pickerWrapper: {
    borderColor: liwiColors.redColor,
    borderWidth: 1,
    backgroundColor: liwiColors.whiteColor,
    borderRadius: 4,
  },
  pickerIcon: {
    zIndex: 100,
    color: liwiColors.redColor,
    position: 'absolute',
    bottom: 10,
    right: 5,
    fontSize: 30,
  },
  pickerContent: {
    color: liwiColors.blackColor,
    borderRadius: 4,
    backgroundColor: liwiColors.whiteColor,
  },
});
