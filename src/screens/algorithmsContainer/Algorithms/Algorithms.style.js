import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  view: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8B8393',
    backgroundColor: '#ffffff',
  },
  marginTop: {
    marginTop: 50,
  },
  number: {
    color: liwiColors.redColor,
    fontWeight: 'bold',
    fontSize: 25,
  },
  smallContent: {
    padding: 20,
  },
  selected: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8B8393',
    backgroundColor: '#5a9542',
  },
  textWithoutIcon: {
    marginTop: 5,
  },
  status: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  textWithIcon: {
    marginTop: 5,
    marginLeft: 20,
  },

  container: {
    flex: 1,
  },

  icons: {
    color: liwiColors.redColor,
    fontSize: 55,
  },

  content: {
    flex: 1,
    backgroundColor: '#F8F4FC',
  },
});
