import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  tools: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activeButtonCategorie: {
    backgroundColor: liwiColors.redColor,
  },
  drawerMinifyWrapButton: {
    flex: 1,
    backgroundColor: '#888',
    borderWidth: 2,
    borderColor: '#7d8815',
  },
  activeTextcategorie: { color: liwiColors.blackColor },
  activeLink: { color: liwiColors.redColor },
  paddingCategory: {
    paddingLeft: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },
  drawerMinifySmallify: {
    // alignSelf: 'flex-end', flex: 1, backgroundColor: '#17881d'
  },
  drawerMinifyView: {
    // flex: 1, flexDirection: 'column', alignItems: 'flex-end'
  },
  drawerMinifyButton: {
    height: 30,
    padding: 0,
    margin: 0,
    backgroundColor: liwiColors.redColor,
    elevation: 3,
  },
  drawerMinifyText: {
    backgroundColor: '#772888',
    margin: 0,
    textAlign: 'center',
  },
  textBottom: { color: liwiColors.whiteColor, fontSize: 19, textAlign: 'left', margin: 0, padding: 0, flexShrink: 1 },
  bottomStyle: {
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  noLeftPadding: {
    paddingLeft: 0,
  },
  bottom: {
    backgroundColor: liwiColors.darkerGreyColor,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 17,
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
    flex: 1,
  },
  margin0: {
    marginLeft: 0,
  },
});
