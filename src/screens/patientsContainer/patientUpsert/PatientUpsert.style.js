import { StyleSheet } from 'react-native';
import { responsiveUi } from '../../../utils/constants';

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

  columns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
