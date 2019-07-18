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
      },
    },
    ChiefComplaints: {
      screen: ChiefComplaints,
    },
    VitalSigns: {
      screen: VitalSigns,
      params: {
        showSummary: true,
      },
    },
    Comorbidities: {
      screen: Comorbidities,
      params: {
        showSummary: true,
      },
    },
    Vaccinations: {
      screen: Vaccinations,
      params: {
        showSummary: true,
      },
    },
    ChiefComplaints: {
      screen: ChiefComplaints,
      params: {
        showSummary: true,
      },
    },

  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: TriageTabs,
  },
);


