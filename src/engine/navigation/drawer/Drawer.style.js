import { StyleSheet } from 'react-native';
import { liwiColors, screenHeight } from '../../../utils/constants';

export const styles = StyleSheet.create({
  tools: {
    flex: 1,
  },
  activeButtonCategorie: {
    backgroundColor: liwiColors.redColor,
  },
  activeTextcategorie: { color: liwiColors.blackColor },
  activeLink: { color: liwiColors.redColor },
  paddingCategory: {
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },
  textBottom: { color: liwiColors.whiteColor, fontSize: 19, textAlign: 'left', margin: 0, padding: 0, flexShrink: 1 },
  bottomStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    textAlign: 'center',
    backgroundColor: liwiColors.darkerGreyColor,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation: 0,
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
    alignItems: 'stretch',
    // padding: 20,
    // paddingLeft: 5,
    // paddingRight: 5,
    justifyContent: 'space-between',
  },
  noLeftPadding: {
    paddingLeft: 0,
  },
  bottom: {
    justifyContent: 'space-between',
    backgroundColor: liwiColors.darkerGreyColor,
  },
  icon: {
    fontSize: 40,
    margin: 0,
    color: liwiColors.whiteColor,
  },
  iconTop: {
    fontSize: 40,
    color: liwiColors.whiteColor,
  },
  medicalCaseNavigationIcon: {
    fontSize: 28,
  },
  rightMedicalCaseNavigationIcon: {
    color: liwiColors.whiteColor,
  },
  columns: {
    flexDirection: 'row',
  },
  margin0: {
    marginLeft: 0,
  },
});
