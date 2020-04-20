import { StyleSheet } from 'react-native';
import { isTablet, liwiColors, screenWidth } from '../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },

  flex: { flex: 1 },

  height: {
    height: 200,
  },

  appContent: { alignItems: 'center', marginTop: 20 },

  buttonSync: { alignSelf: 'center', marginTop: 30 },
  buttonLogout: { alignSelf: 'center' },
  imgKeys: { width: 90, height: 90, margin: 0 },
  lottie: {
    height: isTablet ? 100 : 50,
    alignSelf: 'center',
    marginBottom: isTablet ? 50 : 10,
  },
  textRole: { textAlign: 'center', fontWeight: 'bold' },
  align: { textAlign: 'center' },

  bloc: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignContent: 'center',
    marginTop: -50,
  },

  button: {
    marginTop: 50,
  },

  view: {
    width: screenWidth * 0.8,
    borderColor: liwiColors.redColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 30,
  },
  stylePinCodeColumnDeleteButton: {
    marginLeft: 30,
    marginRight: -10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  stylePinCodeButtonCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: 'rgb(78,80,83)',
    borderRadius: 40,
  },
});
