import { StyleSheet } from "react-native";
import { liwiColors } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: { position: 'absolute', right: 0, top: 0, height: 30, width: 30, zIndex: 1000, margin: 15 },
  viewIcon: { borderRadius: 80, padding: 4, width: 25 },
  icon: { color: liwiColors.whiteColor, fontSize: 16 },
});
