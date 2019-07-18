// @flow
// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import ConsultationTabs from './ConsultationTabs';
import MedicalHistory from '../../screens/medicalCasesContainer/consultationContainer/medicalHistory';
import PhysicalExam from '../../screens/medicalCasesContainer/consultationContainer/physicalExams';
import Poct from '../../screens/medicalCasesContainer/consultationContainer/poct';

export const ConsultationTabNavigator = createMaterialTopTabNavigator(
  {
    MedicalHistory: {
      screen: MedicalHistory,
      params: {
      showSummary: true,
    },
    },
    PhysicalExam: {
      screen: PhysicalExam,
      params: {
      showSummary: true,
    },
    },
    Poct: {
      screen: Poct,
      params: {
      showSummary: true,
    },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: ConsultationTabs,
  },
);

