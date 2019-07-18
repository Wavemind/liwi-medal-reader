import React from 'react';
import Algorithm from '../../screens/algorithmsContainer/Algorithm';
import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import PatientUpsert from '../../screens/patientsContainer/patientUpsert';
import PatientProfile from '../../screens/patientsContainer/patientProfile';
import PatientList from '../../screens/patientsContainer/patientList';
import Settings from '../../screens/settings/';
import WorkCase from '../../screens/medicalCasesContainer/workCase';
import NavigationService from './Navigation.service';

import i18n from '../../utils/i18n';

import { Button, Icon } from 'native-base';

import {
  createDrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { screenWidth } from '../../utils/constants';
import { TriageTabNavigator } from './Triage.navigation';
import { ConsultationTabNavigator } from './Consultation.navigation';
import { DropDownMenu } from './DropDownMenuTop.navigation';
import PatientProfileMenu from './patientProfileMenu';
import PatientSummary from '../../screens/patientsContainer/patientSummary';

// we need to use i18n directly beacause we cant be connect to contexte
const Stack = createStackNavigator({
  Home: {
    screen: MainScreen,
    params: {
      showSummary: false,
    },
    path: 'home',
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t('navigation:patient_list'),
        headerLeft: (
          <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
            <Icon red type={'Entypo'} name="menu" large />
          </Button>
        ),
      };
    },
  },
  PatientList: {
    screen: PatientList,
    path: 'patientList',
    params: {
      showSummary: false,
    },
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t('navigation:patient_list'),
      };
    },
  },
  PatientProfile: {
    screen: PatientProfile,
    path: 'patientProfile',
    params: {
      showSummary: false,
    },
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t('navigation:patient_profile'),
      };
    },
  },
  PatientUpsert: {
    screen: PatientUpsert,
    path: 'patient/',
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t('navigation:patient_upsert'),
      };
    },
  },
  WorkCase: {
    screen: WorkCase,
    path: 'work_case',
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
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t('navigation:settings'),
      };
    },
  },
  Triage: {
    screen: TriageTabNavigator,
    path: 'triage',
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: DropDownMenu,
      };
    },
  },
  Consultation: {
    screen: ConsultationTabNavigator,
    path: 'consultation',
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: DropDownMenu,
      };
    },
  },
});

const HomeWithModal = createStackNavigator(
  {
    Home: { screen: Stack },
    Summary: {
      screen: PatientSummary,
      path: 'summary',
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#434343',
      opacity: 0.9,
    },
    transparentCard: true,
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      },
    }),
  }
);

let StackWithBottomNavigation = createBottomTabNavigator(
  {
    RootBottomTab: { screen: HomeWithModal },
  },
  {
    tabBarComponent: (props) => {
      let currentRoute = NavigationService.getCurrentRoute();

      return <PatientProfileMenu  {...props}  />;
    },
  }
);

StackWithBottomNavigation.navigationOptions = ({ navigation }) => {
  let showSummary = navigation.state.routes[navigation.state.index];

  let tabBarVisible = true;
  if (
    navigation.state.index > 0 &&
    navigation.state.routes[1].routeName === 'Detailscreen'
  ) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

export default () => {
  return createDrawerNavigator(
    { RootDrawer: { screen: StackWithBottomNavigation } },
    {
      drawerWidth: screenWidth / 2,
      contentComponent: (props) => <Drawer {...props} />,
    }
  );
};
