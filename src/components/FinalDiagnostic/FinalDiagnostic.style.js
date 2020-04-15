import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  redIcon: {
    color: liwiColors.redColor,
  },
  greenIcon: {
    color: liwiColors.greenColor,
  },
  bloc: { flexDirection: 'row', flex: 0.4, height: 50 },
  grayIcon: {
    color: liwiColors.darkerGreyColor,
  },
  flex: { flex: 0.55 },
  containerButton: { flexDirection: 'row', flex: 0.4, height: 50 },
  container: { flex: 1, flexDirection: 'row', marginBottom: 5 },
});
