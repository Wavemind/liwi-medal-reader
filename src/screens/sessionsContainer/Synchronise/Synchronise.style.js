import { StyleSheet } from 'react-native';
import { liwiColors, screenHeight, screensScale, screenWidth } from '../../../utils/constants';

let divider = 10;
let extraStyle = { width: 80, height: 80 };
let buttonStyle = { marginTop: 30 };
let textCustom = { marginTop: 30, color: liwiColors.redColor };

// Change flex for small screen
if (screenWidth < screensScale.s) {
  divider = 8;
  extraStyle = { width: 60, height: 60 };
  buttonStyle = { margin: 0, marginTop: 10 };
  textCustom = { marginTop: 10, color: liwiColors.redColor };
}

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight,
  },

  buttonSync: { alignSelf: 'center' },

  bloc: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignContent: 'center',
    marginTop: -50,
  },
});
