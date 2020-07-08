import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  buttonNav: { flex: 0.5, flexDirection: 'row', flexGrow: 1, justifyContent: 'center', width: 100, marginTop: 20 },

  blocScreen: { fontSize: 20 },

  validation: { alignSelf: 'center' },

  warning: { alignSelf: 'center', color: liwiColors.redColor, fontSize: 25 },

  questions: { marginLeft: 15 },

  stepContainer: { flex: 1 },

  screen: { color: liwiColors.redColor, fontWeight: 'bold', fontSize: 25 },

  stepName: { marginTop: 2, marginLeft: 10, marginRight: 10, fontWeight: 'bold' },

  stepHeaderName: { flex: 1, flexDirection: 'row', marginLeft: 20 },

  button: {
    backgroundColor: liwiColors.redColor,
    borderColor: liwiColors.redColor,
    borderWidth: 1,
    borderRadius: 32,
    width: 50,
    height: 50,
  },

  iconValid: { color: liwiColors.greenColor },

  iconInValid: { color: liwiColors.redColor },

  icon: {
    fontSize: 18,
    color: liwiColors.whiteColor,
  },

  textBold: { fontFamily: 'Roboto-Bold', color: liwiColors.redColor, marginTop: 10, textTransform: 'capitalize', alignSelf: 'center' },

  textSub: { alignSelf: 'center' },

  content: { textAlign: 'center' },
});
