import React from 'react';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import MedicalCases from '../../screens/medicalCasesContainer/medicalCases';
import MedicalCase from '../../screens/medicalCasesContainer/medicalCase';
import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Algorithm from '../../screens/algorithmsContainer/Algorithm';
import Settings from '../../screens/settings/';
import WorkCase from '../../screens/medicalCasesContainer/workCase';

import {
  Button,
  Icon,
} from 'native-base';

import {
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';

const Stack = createStackNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Votre espace personnel',
        headerLeft: (
          <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
            <Icon red type={'Entypo'} name="menu" large/>
          </Button>
        ),
      };
    },
  },
  MedicalCases: {
    screen: MedicalCases,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Vos cas médicaux',
      };
    },
  },
  MedicalCase: {
    screen: MedicalCase,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
      };
    },
  },
  WorkCase: {
    screen: WorkCase,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
      };
    },
  },
  Algorithms: {
    screen: Algorithms,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Algorithmes disponibles',
      };
    },
  },
  Algorithm: {
    screen: Algorithm,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
      };
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Paramètres',
      };
    },
  },
});

export default () => {
  return createDrawerNavigator(
    { Home: { screen: Stack } },
    { contentComponent: (props) => <Drawer {...props} /> },
  );
};
