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
  identifierText: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
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
});
