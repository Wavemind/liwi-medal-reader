import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
  },

  filter: {
    marginTop: 40,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  picker: {
    backgroundColor: liwiColors.lightGreyColor,
  },

  textFilter: {
    marginRight: 80,
    marginLeft: 40,
    paddingLeft: 40,
    borderLeftWidth: 1,
    borderLeftColor: liwiColors.redColor,
    textTransform: 'uppercase',
  },

  sorted: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 40,
  },

  textSorted: {
    textTransform: 'uppercase',
    marginRight: 40,
  },
});
