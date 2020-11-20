import { StyleSheet } from 'react-native';
import { responsiveUi } from '../../utils/constants';

export const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: responsiveUi.padding(),
    flex: 1,
  },
});
