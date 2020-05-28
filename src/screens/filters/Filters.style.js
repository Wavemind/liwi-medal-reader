import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  filterButton: {
    marginTop: 5,

    backgroundColor: liwiColors.darkerGreyColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },

  content: {
    padding: 10,
  },

  listItem: { paddingLeft: 0, marginLeft: 0 },
});
