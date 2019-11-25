import { StyleSheet } from 'react-native';
import { liwiColors, screenHeight } from '../../../utils/constants';

export const styles = StyleSheet.create({
  tools: {
    flex: 1,
    height: screenHeight,
    alignItems: 'center',
    paddingTop: 10,
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
    alignItems: 'stretch',
    marginTop: 20,
    padding: 20,
    justifyContent: 'space-between',
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
  medicalCaseNavigationIcon: {
    fontSize: 28,
  },
  rightMedicalCaseNavigationIcon: {
    color: liwiColors.whiteColor,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  margin0: {
    marginLeft: 0,
  },
});
