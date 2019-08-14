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
  paddingCategory: {
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },
  triage: {
    backgroundColor: liwiColors.lighterGreyColor,
  },
  consultation: {
    backgroundColor: liwiColors.lightGreyColor,
  },
  tests: {
    backgroundColor: liwiColors.greyColor,
  },
  strategy: {
    backgroundColor: liwiColors.darkGreyColor,
  },
  patient: {
    backgroundColor: liwiColors.darkerGreyColor,
    height: '100%',
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
    marginTop: 20,
  },
  noLeftPadding: {
    paddingLeft: 0,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  icon: {
    fontSize: 40,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  margin0: {
    marginLeft: 0,
  },
});
