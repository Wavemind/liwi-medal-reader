import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
  },

  marginTop: {
    marginTop: 20,
  },

  centerVertically: {
    marginTop: 250,
  },

  height: {
    height: 200,
  },

  listItem: {
    marginLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 0,
  },

  picker: {
    width: 220,
    backgroundColor: '#F8F8F8',
  },
});
