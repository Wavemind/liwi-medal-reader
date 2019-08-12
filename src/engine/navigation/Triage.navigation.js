// @flow
// import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import Assessments from '../../screens/medicalCasesContainer/triageContainer/assessments';
import ChiefComplaints from '../../screens/medicalCasesContainer/triageContainer/chiefComplaints';
import Comorbidities from '../../screens/medicalCasesContainer/triageContainer/comorbidities';
import Vaccinations from '../../screens/medicalCasesContainer/triageContainer/vaccinations';
import VitalSigns from '../../screens/medicalCasesContainer/triageContainer/vitalSigns';
import TriageTabs from './TriageTabs';

export const TriageTabNavigator = createMaterialTopTabNavigator(
  {
    Assessments: {
      screen: Assessments,
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
    Comorbidities: {
      screen: Comorbidities,
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
