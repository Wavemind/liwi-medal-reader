import { StyleSheet } from 'react-native';
import { liwiColors, responsiveUi } from '../../../utils/constants';

export const styles = StyleSheet.create({
  paddingAuto: {
    padding: 20,
  },

  container: {
    flexGrow: 1,
    padding: responsiveUi.padding(),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerText: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  identifierText: {
    flex: 0.5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: liwiColors.whiteDark,
    borderColor: liwiColors.lightGreyColor,
    borderRadius: 3,
    elevation: 1,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  warning: { padding: 10, backgroundColor: liwiColors.orangeColor, borderRadius: 4, elevation: 1, marginTop: 10, marginBottom: 10 },
});
