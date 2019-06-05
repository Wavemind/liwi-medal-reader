import { StyleSheet } from 'react-native';
import { liwiColors, screenHeight } from '../../../utils/constants';

export const styles = StyleSheet.create({
  tools: {
    backgroundColor: liwiColors.greyColor,
    height: screenHeight,
    flex: 0.3,
    alignItems: 'center',
    paddingTop: 10,
  },

  medical: {
    flex: 0.7,
    height: screenHeight,
  },

  triage: {
    backgroundColor: liwiColors.lighterGreyColor,
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },

  consultation: {
    backgroundColor: liwiColors.lightGreyColor,
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },

  tests: {
    backgroundColor: liwiColors.greyColor,
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },

  strategy: {
    backgroundColor: liwiColors.darkGreyColor,
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },

  patient: {
    backgroundColor: liwiColors.darkerGreyColor,
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },

  content: {
    padding: 20,
  },

  title: {
    textTransform: 'uppercase',
    fontSize: 20,
    paddingBottom: 10,
  },

  top: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 40,
  },

  icon: {
    color: liwiColors.blackColor,
    fontSize: 35,
  },

  columns: {
    flex: 1,
    flexDirection: 'row',
  },
});
