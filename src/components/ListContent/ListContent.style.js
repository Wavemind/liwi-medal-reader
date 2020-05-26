import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  item: {
    paddingLeft: 10,
    elevation: 1,
    borderRadius: 4,
    height: 80,
    marginRight: 2,
    marginLeft: 2,
    borderWidth: 0,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: liwiColors.whiteDark
  },

  columnLabel: {
    flex: 1,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: liwiColors.lightGreyColor,
    borderColor: liwiColors.lighterGreyColor,
    borderRadius: 4,
    elevation: 1,
  },

  separator: {
    height: 3,
    width: '100%',
    backgroundColor: liwiColors.lighterGreyColor
  },

  filterContent: { flexDirection: 'row', paddingBottom: 5 },

  filterButton: { flex: 0.40, borderRadius: 5, alignSelf: 'flex-end', justifyContent: 'center' },

  flatList: { paddingBottom: 220 },
});
