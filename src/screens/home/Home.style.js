import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  navigationButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    padding: 5,
    paddingTop: 30,
    paddingBottom: 30,
  },
  icons: {
    color: liwiColors.blackColor,
    fontSize: 45
  }
});
