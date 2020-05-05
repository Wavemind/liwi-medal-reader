import { StyleSheet } from "react-native";
import { liwiColors } from "../../utils/constants";

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
  width50: { width: 50 },
  customItem: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  iconSize: { fontSize: 18 },
});
