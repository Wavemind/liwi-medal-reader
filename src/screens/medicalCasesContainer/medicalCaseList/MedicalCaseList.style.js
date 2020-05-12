import { StyleSheet } from "react-native";
import { liwiColors } from "../../../utils/constants";

export const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
  filters: {
    flex: 1,
    flexDirection: 'row',
    flexBasis: 1000,
  },
  filter: {
    marginTop: 40,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  picker: {
    backgroundColor: liwiColors.lightGreyColor,
  },

  textFilter: {
    marginRight: 80,
    marginLeft: 40,
    paddingLeft: 40,
    borderLeftWidth: 1,
    borderLeftColor: liwiColors.redColor,
    textTransform: 'uppercase',
  },

  lock: { color: liwiColors.redColor },
  unlock: { color: liwiColors.greenColor },

  sorted: {
    marginTop: 30,
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    marginBottom: 40,
  },

  textSorted: {
    textTransform: 'uppercase',
    marginRight: 40,
  },
});
