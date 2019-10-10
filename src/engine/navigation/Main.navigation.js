import React from 'react';
import { Button, Icon } from 'native-base';
import {
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import Algorithm from '../../screens/algorithmsContainer/Algorithm';
import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import PatientUpsert from '../../screens/patientsContainer/patientUpsert';
import PatientProfile from '../../screens/patientsContainer/patientProfile';
import PatientList from '../../screens/patientsContainer/patientList';
import Settings from '../../screens/settings';
import NavigationService from './Navigation.service';
import i18n from '../../utils/i18n';

import { screenWidth } from '../../utils/constants';
import PatientSummaryMenu from './patientSummaryMenu';
import MedicalCaseSummary from '../../screens/medicalCasesContainer/medicalCaseSummary';
import MedicalCaseList from '../../screens/medicalCasesContainer/medicalCaseList';
import Tests from '../../screens/medicalCasesContainer/tests';
import DiagnosticsStrategy from '../../screens/medicalCasesContainer/DiagnosticsStrategyContainer/DiagnosticsStrategy';
import { medicalCaseStatus } from '../../../frontend_service/constants';
import Emergency from '../../screens/Emergency';
import Triage from '../../screens/medicalCasesContainer/triage';
import Consultation from '../../screens/medicalCasesContainer/consultation';

// We need to use i18n directly because we cant be connect to context
const Stack = createStackNavigator(
  {
    Home: {
      screen: MainScreen,
      params: {
        showSummary: false,
      },
      path: 'home',

      navigationOptions: ({ navigation }) => {
        return {
          title: i18n.t('navigation:home'),
          headerLeft: (
            <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
              <Icon red type="Entypo" name="menu" large />
            </Button>
          ),
          headerTitleContainerStyle: {
            marginLeft: 15,
          },
        };
      },
    },
    Emergency: {
      screen: Emergency,
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:emergency'),
        };
      },
    },
    PatientList: {
      screen: PatientList,
      path: 'patientList',
      params: {
        showSummary: false,
      },
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
      params: {
        showSummary: false,
      },
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:patient_upsert'),
        };
      },
    },
    Algorithms: {
      screen: Algorithms,
      path: 'algorithms',
      params: {
        showSummary: false,
      },
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:available_algorithms'),
        };
      },
    },
    MedicalCaseList: {
      screen: MedicalCaseList,
      path: 'medicalCaseList',
      params: {
        showSummary: false,
      },
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:medical_case_list'),
        };
      },
    },
    Algorithm: {
      screen: Algorithm,
      path: 'algorithm/:id',
      params: {
        showSummary: false,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Settings: {
      screen: Settings,
      path: 'settings',
      params: {
        showSummary: false,
      },
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:settings'),
        };
      },
    },
    Triage: {
      screen: Triage,
      path: 'triage',
      params: {
        title: '',
        showSummary: true,
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name,
        nextStage: medicalCaseStatus.waitingConsultation.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Consultation: {
      screen: Consultation,
      path: 'consultation',
      params: {
        showSummary: true,
        dropDownMenu: 'Consultation',
        medicalCaseStatus: medicalCaseStatus.consultation.name,
        nextStage: medicalCaseStatus.waitingTest.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Tests: {
      screen: Tests,
      path: 'tests',
      params: {
        showSummary: true,
        dropDownMenu: 'Tests',
        medicalCaseStatus: medicalCaseStatus.test.name,
        nextStage: medicalCaseStatus.waitingDiagnostic.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    DiagnosticsStrategy: {
      screen: DiagnosticsStrategy,
      path: 'DiagnosticsStrategy',
      params: {
        showSummary: true,
        dropDownMenu: 'DiagnosticsStrategy',
        medicalCaseStatus: medicalCaseStatus.final_diagnostic.name,
        nextStage: medicalCaseStatus.close.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
  },
  {
    headerMode: 'float',
    headerBackTitleVisible: false,
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerBackTitleVisible: false,
        headerLeft: (
          <React.Fragment>
            <Button iconMenu onPress={() => navigation.openDrawer()}>
              <Icon red type="Entypo" name="menu" large />
            </Button>
            <Button backIconMenu onPress={() => navigation.goBack()}>
              <Icon red type="AntDesign" name="back" medium />
            </Button>
          </React.Fragment>
        ),
        headerTitleContainerStyle: {
          marginLeft: 50,
        },
      };
    },
  }
);

const HomeWithModal = createStackNavigator(
  {
    Home: { screen: Stack },
    Summary: {
      screen: MedicalCaseSummary,
      path: 'summary',
      params: {
        showSummary: false,
      },
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'transparent',
      opacity: 1,
    },
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
      if (currentRoute.params?.showSummary ?? false) {
        return <PatientSummaryMenu {...props} />;
      }
      return null;
    },
  }
);

const MainNavigation = () => {
  return createDrawerNavigator(
    {
      RootDrawer: { screen: StackWithBottomNavigation },
    },
    {
      drawerWidth: screenWidth / 2,
      overlayColor: 'rgba(38,38,38,0.8)',
      contentComponent: (props) => <Drawer {...props} />,
    }
  );
};

export default MainNavigation;
