import { StyleSheet } from "react-native";
import { liwiColors } from "../../../utils/constants";

export const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priority: {
    backgroundColor: '#d8d8d8',
  },
  button: {
    backgroundColor: liwiColors.redColor,
    borderColor: liwiColors.redColor,
    borderWidth: 1,
    borderRadius: 32,
    width: 50,
    height: 50,
  },
  iconInfo: { color: liwiColors.redColor },
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
