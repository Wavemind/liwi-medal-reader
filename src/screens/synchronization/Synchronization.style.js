import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  marginTop: { marginTop: 10 },

  number: { flex: 1, textAlign: 'center', fontSize: 125 },
  error: { flex: 1, textAlign: 'center', fontSize: 20, color: liwiColors.redColor },
});
