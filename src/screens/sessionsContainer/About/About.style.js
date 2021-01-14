import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flexColumn: { flex: 1, flexDirection: 'column' },
  center: { textAlign: 'center', marginTop: 10 },
  content: { paddingLeft: 30, paddingRight: 30, paddingBottom: 30, flex: 1, flexGrow: 1 },
  aboutDescription: { marginBottom: 15, textAlign: 'left', flex: 1 },
  italic: { fontStyle: 'italic' },
  button: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 13,
    alignSelf: 'flex-end',
    marginRight: 20,
    height: 'auto',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footer: { elevation: 1 },
});
