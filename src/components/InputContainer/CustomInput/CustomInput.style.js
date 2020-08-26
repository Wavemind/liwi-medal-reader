import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  icon: {
    fontSize: 25,
    color: liwiColors.redColor,
    marginRight: 5,
  },

  form: {
    marginTop: 20,
    marginBottom: 20,
  },

  view: {
    flexDirection: 'row',
    paddingBottom: 5,
  },

  textWithoutIcon: {
    marginTop: 5,
  },

  textWithIcon: {
    marginTop: 5,
    marginLeft: 15,
  },
});
