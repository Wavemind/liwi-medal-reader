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
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 50,
    paddingRight: 50,
    borderTopWidth: 2,
    borderTopColor: liwiColors.lighterGreyColor,
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
    width: 7,
    height: 30,
    backgroundColor: liwiColors.redColor,
  },

  track: {
    height: 18,
    backgroundColor: liwiColors.lighterGreyColor,
  },
});
