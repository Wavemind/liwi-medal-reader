import { StyleSheet } from "react-native";
import { liwiColors, screenHeight, screensScale, screenWidth } from "../../../utils/constants";

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

  appContent: {
    alignItems: 'center',
    marginTop: 20,
  },

  textCustom: {
    ...textCustom,
  },

  buttonSync: { alignSelf: 'center' },

  buttonLogout: {
    alignSelf: 'center',
    ...buttonStyle,
  },

  imgKeys: { width: 90, height: 90, margin: 0 },

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
    backgroundColor: 'rgb(78,80,83)',
    borderRadius: 40,
    ...extraStyle,
  },

  stylePinCodeDeleteButtonText: {
    fontWeight: '200',
    marginTop: 5,
    fontSize: 18,
  },

  stylePinCodeRowButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight / divider,
  },

  stylePinCodeColumnButtons: {
    justifyContent: 'center', alignItems: 'center', width: 'auto'
  },

  stylePinCodeMainContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
