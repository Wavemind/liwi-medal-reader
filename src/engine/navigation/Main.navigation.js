import React from 'react';
import { Button, Icon } from 'native-base';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Algorithm from '../../screens/algorithmsContainer/Algorithm';
import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import PatientUpsert from '../../screens/patientsContainer/patientUpsert';
import PatientProfile from '../../screens/patientsContainer/patientProfile';
import PatientList from '../../screens/patientsContainer/patientList';
import Settings from '../../screens/settings';

import i18n from '../../utils/i18n';
import { screenWidth } from '../../utils/constants';
import { TriageTabNavigator } from './Triage.navigation';
import { ConsultationTabNavigator } from './Consultation.navigation';
import DropDownMenu from './DropDownMenuTop.navigation';

// we need to use i18n directly beacause we cant be connect to contexte
const Stack = createStackNavigator({
  Home: {
    screen: MainScreen,
    path: 'home',
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t('navigation:patient_list'),
        headerLeft: (
          <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
            <Icon red type="Entypo" name="menu" large />
          </Button>
        ),
      };
    },
  },
  PatientList: {
    screen: PatientList,
    path: 'patientList',
    navigationOptions: () => {
      return {
        title: i18n.t('navigation:patient_list'),
      };
    },
  },
  PatientProfile: {
    screen: PatientProfile,
    path: 'patientProfile',
    navigationOptions: () => {
      return {
        title: i18n.t('navigation:patient_profile'),
      };
    },
  },
  PatientUpsert: {
    screen: PatientUpsert,
    path: 'patient/',
    navigationOptions: () => {
      return {
        title: i18n.t('navigation:patient_upsert'),
      };
    },
  },
  Algorithms: {
    screen: Algorithms,
    path: 'algorithms',
    navigationOptions: () => {
      return {
        title: i18n.t('navigation:available_algorithms'),
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
    navigationOptions: () => {
      return {
        title: i18n.t('navigation:settings'),
      };
    },
  },
  Triage: {
    screen: TriageTabNavigator,
    path: 'triage',
    navigationOptions: () => {
      return {
        headerTitle: DropDownMenu,
      };
    },
  },
  Consultation: {
    screen: ConsultationTabNavigator,
    path: 'consultation',
    navigationOptions: () => {
      return {
        headerTitle: DropDownMenu,
      };
    },
  },
});

export default () => {
  return createDrawerNavigator(
    { Home: { screen: Stack } },
    {
      drawerWidth: screenWidth / 2,
      contentComponent: (props) => <Drawer {...props} />,
    }
  );
};
