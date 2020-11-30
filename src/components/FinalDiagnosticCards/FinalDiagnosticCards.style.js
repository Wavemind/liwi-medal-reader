import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  patientContainer: { flexDirection: 'row', marginTop: 20, marginBottom: 20 },

  flex: { flex: 1 },

  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  iconInfo: {
    color: liwiColors.redColor,
    marginTop: 10,
    alignSelf: 'flex-start',
  },

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
  drugContainer: { flex: 1, flexDirection: 'row' },
  tooltipButton: { flex: 0.1, alignSelf: 'center', alignItems: 'flex-end' },
  tooltipButtonFinalDiagnostic: { flex: 0.1, alignSelf: 'center', alignItems: 'flex-end' },
  formulationContainer: { flex: 0.9 },
});
