import { StyleSheet } from 'react-native';
import { liwiColors, screenWidth } from '../../../utils/constants';

export const styles = StyleSheet.create({
  title: { color: liwiColors.blackLightColor, fontSize: 22, fontWeight: '100', fontFamily: 'Roboto-Light' },
  desc: { color: liwiColors.blackLightColor, fontFamily: 'Roboto-Bold', justifyContent: 'flex-start', fontSize: 25 },
  img: { width: 70, height: 70, margin: 10 },
  icon: { position: 'absolute', right: -10, bottom: -10, color: liwiColors.redColor, backgroundColor: liwiColors.whiteColor, borderRadius: 50, padding: 0, elevation: 3, fontSize: 35 },
  bloc: {
    flexDirection: 'column',
    width: screenWidth / 2 - 41,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    margin: 20,
    justifyContent: 'flex-start',
    flexGrow: 1,
    alignItems: 'center',
  },
  items: { flex: 1, margin: 10 },
  blocParent: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  button: { flexDirection: 'row', marginBottom: 20, alignSelf: 'flex-end', marginRight: 20, height: 'auto', justifyContent: 'center', flexWrap: 'wrap' },
  blocName: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' },
  blocBackground: { width: screenWidth, backgroundColor: liwiColors.lighterGreyColor },
  touchable: { elevation: 0, backgroundColor: 'transparent' },
  textBloc: { flexDirection: 'row', paddingBottom: 5 },
  textIcon: { fontSize: 25, color: liwiColors.redColor, marginRight: 5 },
  roleText: { marginTop: 5, marginLeft: 15 }
});
