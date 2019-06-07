import React from 'react';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import MedicalCases from '../../screens/medicalCasesContainer/medicalCases';
import MedicalCase from '../../screens/medicalCasesContainer/medicalCase';
import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Algorithm from '../../screens/algorithmsContainer/Algorithm';
import Settings from '../../screens/settings/';
import WorkCase from '../../screens/medicalCasesContainer/workCase';
import i18n from '../../utils/i18n';

import { Button, Icon } from 'native-base';

import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { screenWidth } from '../../utils/constants';

const Stack = createStackNavigator(
  {
    Home: {
      screen: MainScreen,
      path: 'home',
      navigationOptions: ({ navigation }) => {
        return {
          title: i18n.t('common:title_home'),
          headerLeft: (
            <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
              <Icon red type={'Entypo'} name="menu" large />
            </Button>
          ),
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
  {
    // initialRouteName: 'Settings',
  }
);

export default () => {
  return createDrawerNavigator(
    { Home: { screen: Stack } },
    {
      drawerWidth: screenWidth / 2,
      contentComponent: (props) => <Drawer {...props} />,
    }
  );
};
