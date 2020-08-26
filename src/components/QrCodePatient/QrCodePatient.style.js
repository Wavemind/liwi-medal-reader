import { StyleSheet } from 'react-native';
import { liwiColors, screenWidth } from '../../utils/constants';

export const styles = StyleSheet.create({
  centerText: {
    color: liwiColors.blackLightColor,
    margin: 20,
  },
  content: { flex: 1, flexDirection: 'column', backgroundColor: '#000' },
  camera: { height: 100, width: 'auto', flex: 1 },
  marker: {
    width: screenWidth / 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderColor: liwiColors.whiteColor,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 3,
    position: 'relative',
  },
});
