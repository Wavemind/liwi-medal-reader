import { StyleSheet } from 'react-native';

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
  smallContent: {
    padding: 10,
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

  textWithIcon: {
    marginTop: 5,
    marginLeft: 20,
  },

  container: {
    flex: 2,
  },

  content: {
    flex: 7,
    backgroundColor: '#F8F4FC',
  },
});
