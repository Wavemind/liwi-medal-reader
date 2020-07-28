import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  time: {
    alignSelf: 'center',
  },

  pauseButton: {
    marginBottom: 8,
  },

  audioInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 7,
    alignItems: 'stretch',
  },

  thumb: {
    backgroundColor: liwiColors.redColor,
  },

  track: {
    backgroundColor: liwiColors.lighterGreyColor,
  },
});
