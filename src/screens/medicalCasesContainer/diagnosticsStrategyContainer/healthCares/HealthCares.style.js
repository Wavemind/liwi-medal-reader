import { StyleSheet } from 'react-native';
import { liwiColors, responsiveUi } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  spaceText: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 22,
  },
  blocManagement: { borderBottomWidth: 0.5, borderColor: liwiColors.redColor },
  desc: {
    marginBottom: 20,
    marginLeft: 40,
    fontSize: 18,
  },
  padded: {
    padding: responsiveUi.padding(),
  },
});
