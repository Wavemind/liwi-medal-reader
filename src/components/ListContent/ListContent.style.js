import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  item: {
    paddingLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 4,
    height: 80,
    marginRight: 5,
    marginLeft: 5,
    borderWidth: 0,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: liwiColors.whiteDark,
  },

  separator: {
    height: 3,
    width: '100%',
    backgroundColor: liwiColors.lighterGreyColor,
  },

  filterContent: { flexDirection: 'row', paddingBottom: 5 },

  filterButton: { flex: 0.13, borderRadius: 5, alignSelf: 'flex-end', justifyContent: 'center' },

  sortButton: { borderRadius: 5 },

  flatList: { paddingBottom: 220 },
});
