import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  cardItemCondensed: {
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 7,
    paddingBottom: 7,
  },
  cardTitleContent: { flexDirection: 'row', flex: 1, justifyContent: 'center' },
  cardTitle: { flex: 1, fontSize: 18 },
  noRightMargin: { marginRight: 0 },
  healthCareTitle: { width: '100%', borderBottomWidth: 2, borderBottomColor: liwiColors.redColor, marginTop: 10 },
  padding: { paddingTop: 10, paddingBottom: 5 },
});
