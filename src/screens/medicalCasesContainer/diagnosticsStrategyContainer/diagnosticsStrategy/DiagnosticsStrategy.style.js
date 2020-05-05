import { StyleSheet } from "react-native";
import { responsiveUi } from "../../../../utils/constants";

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  pad: {
    paddingHorizontal: responsiveUi.padding(),
    flex: 1,
  },
  padded: {
    padding: responsiveUi.padding(),
  },
});
