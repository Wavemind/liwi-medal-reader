import { StyleSheet } from 'react-native';

const elevationSize = 2;

export const styles = StyleSheet.create({
  flexColumn: { flex: 1, flexDirection: 'column' },
  center: { textAlign: 'center', marginTop: 10 },
  content: { paddingLeft: 30, paddingRight: 30, paddingBottom: 30, flex: 1, flexGrow: 1 },
  aboutDescription: { marginBottom: 15, textAlign: 'left', flex: 1 },
  italic: { fontStyle: 'italic' },
  webview: { marginTop: 20, backgroundColor: 'transparent', flex: 1 },
  button: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 13,
    alignSelf: 'flex-end',
    marginRight: 20,
    height: 'auto',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footer: {
    paddingTop: 5,
    elevation: elevationSize,
    marginHorizontal: -elevationSize,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
