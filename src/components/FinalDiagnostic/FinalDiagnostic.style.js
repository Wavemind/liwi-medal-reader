import { StyleSheet } from 'react-native';
import { liwiColors } from '../../utils/constants';

export const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    marginRight: 7,
  },
  iconInfo: { color: liwiColors.redColor },
  redIcon: {
    color: liwiColors.redColor,
  },
  greenIcon: {
    color: liwiColors.greenColor,
  },
  bloc: {
    flexDirection: 'row',
    flex: 1,
    height: 50,
    paddingLeft: 5,
    fontSize: 11,
  },
  grayIcon: {
    color: liwiColors.darkerGreyColor,
  },
  flex: { flex: 0.55 },
  containerButton: {
    flexDirection: 'row',
    flex: 0.4,
    height: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: liwiColors.whiteColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  content: { flexDirection: 'row' },
});
