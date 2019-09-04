// @flow
// import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import Assessments from '../../screens/medicalCasesContainer/triageContainer/assessments';
import ChiefComplaints from '../../screens/medicalCasesContainer/triageContainer/chiefComplaints';
import Comorbidities from '../../screens/medicalCasesContainer/triageContainer/comorbidities';
import Vaccinations from '../../screens/medicalCasesContainer/triageContainer/vaccinations';
import VitalSigns from '../../screens/medicalCasesContainer/triageContainer/vitalSigns';
import TriageTabs from './TriageTabs';
import { medicalCaseStatus } from '../../../frontend_service/constants';

export const TriageTabNavigator = createMaterialTopTabNavigator(
  {
    Assessments: {
      screen: Assessments,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name
      },
    },
    ChiefComplaints: {
      screen: ChiefComplaints,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name
      },
    },
    VitalSigns: {
      screen: VitalSigns,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name
      },
    },
    Comorbidities: {
      screen: Comorbidities,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name
      },
    },
    Vaccinations: {
      screen: Vaccinations,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name
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
