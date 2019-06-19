import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation/typescript/react-navigation';
import ConsultationTabs from './ConsultationTabs';
import MedicalHistory from '../../../screens/medicalCasesContainer/consultationContainer/medicalHistory';
import PhysicalExam from '../../../screens/medicalCasesContainer/consultationContainer/physicalExam';
import Poct from '../../../screens/medicalCasesContainer/consultationContainer/poct';

export const ConsultationTabNavigator = createMaterialTopTabNavigator(
  {
    MedicalHistory: {
      screen: MedicalHistory,
    },
    PhysicalExam: {
      screen: PhysicalExam,
    },
    Poct: {
      screen: Poct,
    },

  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: ConsultationTabs,
  },
);

