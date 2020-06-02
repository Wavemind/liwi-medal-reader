import { StyleSheet } from 'react-native';
import { responsiveUi } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: responsiveUi.padding(),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
