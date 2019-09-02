// @flow
// import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import FirstLookAssessments from '../../screens/medicalCasesContainer/triageContainer/firstLookAssessments';
import ChiefComplaints from '../../screens/medicalCasesContainer/triageContainer/chiefComplaints';
import ChronicalConditions from '../../screens/medicalCasesContainer/triageContainer/chronicalConditions';
import Vaccinations from '../../screens/medicalCasesContainer/triageContainer/vaccinations';
import VitalSigns from '../../screens/medicalCasesContainer/triageContainer/vitalSigns';
import TriageTabs from './TriageTabs';

export const TriageTabNavigator = createMaterialTopTabNavigator(
  {
    FirstLookAssessments: {
      screen: FirstLookAssessments,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage'
      },
    },
    ChiefComplaints: {
      screen: ChiefComplaints,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage'
      },
    },
    VitalSigns: {
      screen: VitalSigns,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage'
      },
    },
    ChronicalConditions: {
      screen: ChronicalConditions,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage'
      },
    },
    Vaccinations: {
      screen: Vaccinations,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage'
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: TriageTabs,
    lazy: true,
    optimizationsEnabled: true,
  }
);
