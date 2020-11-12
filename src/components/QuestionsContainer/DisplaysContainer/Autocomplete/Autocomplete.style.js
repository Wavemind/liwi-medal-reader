import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
  },
  autocompleteStyle: { padding: 15, backgroundColor: liwiColors.whiteColor },
  autocompleteContainer: { borderWidth: 0, marginTop: 15 },
  autocompleteList: { backgroundColor: liwiColors.whiteColor, width: '100%', marginLeft: 0 },
  autocompleteTouchableOpacity: { flex: 1, paddingLeft: 5, paddingTop: 15, paddingBottom: 15, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: liwiColors.lighterGreyColor },
  autocompleteText: { lineHeight: 30 },
});
