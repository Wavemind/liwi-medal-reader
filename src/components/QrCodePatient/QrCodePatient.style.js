import { StyleSheet } from "react-native";
import { liwiColors, screenWidth } from "../../utils/constants";

export const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    color: liwiColors.blackLightColor,
  },
  content: { flex: 1, flexDirection: 'column' },
  camera: { height: 100, width: 'auto', flex: 1 },
  marker: {
    width: screenWidth / 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: liwiColors.whiteColor,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 3,
    position: 'relative',
  },
});
