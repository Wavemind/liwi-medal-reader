import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  navigationButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: liwiColors.lighterGreyColor,
    borderWidth: 1,
    borderColor: liwiColors.lightGreyColor,
  },
  icons: {
    color: liwiColors.redColor,
    fontSize: 45
  }
});
