import { StyleSheet } from "react-native";

import { liwiColors } from "../../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: liwiColors.lightGreyColor,
  },

  view: {
    flex: 0.8,
  },

  grid: {
    flex: 0.2,
  },

  round: {
    borderRadius: 50,
    height: 60,
    width: 60,
  },

  active: {
    backgroundColor: liwiColors.darkGreyColor,
  },

  unactive: {
    backgroundColor: liwiColors.whiteColor,
  },

  touchable: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#dadada',
  },
});
