// @flow
// import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import FirstLookAssessments from '../../screens/medicalCasesContainer/triageContainer/firstLookAssessments';
import ChiefComplaints from '../../screens/medicalCasesContainer/triageContainer/chiefComplaints';
import VitalSigns from '../../screens/medicalCasesContainer/triageContainer/vitalSigns';
import TriageTabs from './TriageTabs';
import { medicalCaseStatus } from '../../../frontend_service/constants';

export const TriageTabNavigator = createMaterialTopTabNavigator(
  {
    FirstLookAssessments: {
      screen: FirstLookAssessments,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name,
      },
    },
    ChiefComplaints: {
      screen: ChiefComplaints,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name,
      },
    },
    VitalSigns: {
      screen: VitalSigns,
      params: {
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name,
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: TriageTabs,
    // lazy: true,
    optimizationsEnabled: true,
  }
);
