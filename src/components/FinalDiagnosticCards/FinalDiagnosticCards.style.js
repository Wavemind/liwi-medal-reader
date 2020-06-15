import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  patientContainer: { flexDirection: 'row', marginTop: 20, marginBottom: 20 },

  flex: { flex: 1 },

  alignRight: { flex: 1, alignItems: 'flex-end' },

  cardItemCondensed: {
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 7,
    paddingBottom: 7,
  },
  cardTitleContent: { flexDirection: 'row', flex: 1, justifyContent: 'center' },
  cardTitle: { flex: 1, fontSize: 18 },
  noRightMargin: { marginRight: 0 },
});
