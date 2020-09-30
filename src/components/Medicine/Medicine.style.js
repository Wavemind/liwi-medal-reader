import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  width50: { width: 50 },
  main: { flex: 1, flexDirection: 'row', marginBottom: 5, paddingBottom: 10, paddingTop: 10 },
  customItem: { flex: 1, flexDirection: 'row', marginBottom: 5 },
  iconSize: { fontSize: 18 },
  flex: { flex: 0.6 },
  smallFlex: { flex: 0.7, height: '100%', marginTop: 0 },
  content: { flexDirection: 'row', flex: 0.4, height: 45 },
  label: { fontSize: 13 },
});
