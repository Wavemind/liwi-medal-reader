// @flow
// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import ConsultationTabs from './ConsultationTabs';
import MedicalHistory from '../../screens/medicalCasesContainer/consultationContainer/medicalHistory';
import PhysicalExam from '../../screens/medicalCasesContainer/consultationContainer/physicalExams';
import { medicalCaseStatus } from '../../../frontend_service/constants';

export const ConsultationTabNavigator = createMaterialTopTabNavigator(
  {
    MedicalHistory: {
      screen: MedicalHistory,
      params: {
        showSummary: true,
        dropDownMenu: 'Consultation',
        medicalCaseStatus: medicalCaseStatus.consultation.name
      },
    },
    PhysicalExam: {
      screen: PhysicalExam,
      params: {
        showSummary: true,
        dropDownMenu: 'Consultation',
        medicalCaseStatus: medicalCaseStatus.consultation.name
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: ConsultationTabs,
  }
);
