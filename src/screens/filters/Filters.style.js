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

  container: {
    flex: 1,
    marginTop: 50,
  },

  bottomButton: { bottom: 0, left: 0, right: 0, height: '10%', position: 'absolute' },

  clearAll: {
    left: 0,
    paddingLeft: 0,
    marginLeft: 0,
    width: '95%',
    height: '100%',
    borderRightWidth: 5,
    borderRightColor: liwiColors.darkerGreyColor,
  },

  apply: { width: '100%', height: '100%', marginLeft: 0 },

  listItem: { paddingLeft: 0, marginLeft: 0 },

  filtersHeight: { height: '90%' },
});
