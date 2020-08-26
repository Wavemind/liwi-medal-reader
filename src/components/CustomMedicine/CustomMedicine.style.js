import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  container: { borderRadius: 2, marginBottom: 20 },
  item: { flex: 1, flexDirection: 'row' },
  input: { flex: 1 },
  button: { height: 50, marginTop: 0 },
  icon: { fontSize: 18 },
  drugContainer: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  title: { backgroundColor: liwiColors.redColor, color: liwiColors.whiteColor, padding: 4, borderRadius: 2, paddingLeft: 20, marginBottom: 20 },
  cardItemCondensed: {
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 7,
    paddingBottom: 7,
  },
  cardItemTitleContent: { flexDirection: 'row', flex: 1, justifyContent: 'center' },
  cardItemTitle: { flex: 1, fontSize: 18 },
  noRightMargin: { marginRight: 0 },
});
