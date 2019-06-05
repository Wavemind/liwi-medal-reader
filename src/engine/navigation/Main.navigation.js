import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import Algorithm from '../../screens/algorithmsContainer/Algorithm';
import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import MedicalCases from '../../screens/medicalCasesContainer/medicalCases';
import MedicalCase from '../../screens/medicalCasesContainer/medicalCase';
import PatientList from '../../screens/patientsContainer/patientList';
import Settings from '../../screens/settings/';
import WorkCase from '../../screens/medicalCasesContainer/workCase';

import i18n from '../../utils/i18n';
import { Button, Icon } from 'native-base';

const Stack = createStackNavigator(
  {
    Home: {
      screen: MainScreen,
      path: 'home',
      navigationOptions: ({ navigation }) => {
        return {
          title: i18n.t('common:patient_list'),
          headerLeft: (
            <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
              <Icon red type={'Entypo'} name="menu" large/>
            </Button>
          ),
        };
      },
    },
    PatientList: {
      screen: PatientList,
      path: 'patientList',
      navigationOptions: ({ navigation }) => {
        return {
          title: 'TRADUCTION',
        };
      },
    },
    MedicalCases: {
      screen: MedicalCases,
      path: 'medicalCases',
      navigationOptions: ({ navigation }) => {
        return {
          title: 'Vos cas médicaux',
        };
      },
    },
    MedicalCase: {
      screen: MedicalCase,
      path: 'medicalCases/:id',
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    WorkCase: {
      screen: WorkCase,
      path: 'workcase',
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Algorithms: {
      screen: Algorithms,
      path: 'algorithms',
      navigationOptions: ({ navigation }) => {
        return {
          title: i18n.t('common:algorithms_av'),
        };
      },
    },
    Algorithm: {
      screen: Algorithm,
      path: 'algorithm/:id',
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Settings: {
      screen: Settings,
      path: 'settings',
      navigationOptions: ({ navigation }) => {
        return {
          title: i18n.t('common:settings'),
        };
      },
    },
  },
);

export default () => {
  return createDrawerNavigator(
    { Home: { screen: Stack } },
    {
      contentComponent: (props) => <Drawer {...props} />,
    },
  );
};
