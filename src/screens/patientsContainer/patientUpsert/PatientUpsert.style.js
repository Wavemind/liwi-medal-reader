import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({

  paddingAuto: {
    padding: 20,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  columns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
