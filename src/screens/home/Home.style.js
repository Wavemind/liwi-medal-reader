import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  navigationButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: liwiColors.whiteDark,
    borderColor: liwiColors.lightGreyColor,
    borderRadius: 3,
    elevation: 1,
  },
  blocContainer: { justifyContent: 'center', alignItems: 'center' },
  icons: {
    width: 60,
    height: 60,
  },
  textButton: { color: liwiColors.blackLightColor },

  warningBloc: {
    backgroundColor: liwiColors.orangeColor,
    borderRadius: 3,
    padding: 15,
    elevation: 1,
    marginLeft: 10,
    marginRight: 10,
    borderColor: liwiColors.lightGreyColor,
    marginBottom: 10,
    marginTop: -20,
  },
});
