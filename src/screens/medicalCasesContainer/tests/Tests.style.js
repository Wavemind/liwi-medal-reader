import { StyleSheet } from 'react-native';
import { responsiveUi } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pad: {
    paddingHorizontal: responsiveUi.padding(),
    flex: 1,
  },
});
