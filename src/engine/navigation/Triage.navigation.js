import React from 'react';
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
    },
    ChiefComplaints: {
      screen: ChiefComplaints,
    },
    VitalSigns: {
      screen: VitalSigns,
    },
    Comorbidities: {
      screen: Comorbidities,
    },
    Vaccinations: {
      screen: Vaccinations,
    },

  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: TriageTabs,
  },
);


