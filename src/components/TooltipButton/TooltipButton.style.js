import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInfo: { color: liwiColors.redColor },
  icon: {
    fontSize: 18,
    color: liwiColors.whiteColor,
  },
  description: { textAlign: 'left', flex: 1 },
});
