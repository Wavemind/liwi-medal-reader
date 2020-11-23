import { StyleSheet } from 'react-native';
import { responsiveUi } from '../../utils/constants';

export const styles = StyleSheet.create({
  alignRight: { alignSelf: 'flex-end' },
  text: { marginTop: 10, marginBottom: 10 },
  activeTextArea: { backgroundColor: '#fff', borderRadius: 4 },
  disabledTextArea: { margin: 4, backgroundColor: '#fff', borderRadius: 4 },
  pad: {
    paddingHorizontal: responsiveUi.padding(),
    flex: 1,
  },
});
