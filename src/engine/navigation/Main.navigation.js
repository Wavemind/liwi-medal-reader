import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Button, Icon } from 'native-base';

import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import MedicalCases from '../../screens/medicalCases';
import MedicalCase from '../../screens/medicalCase';
import Algorithmes from '../../screens/algorithmesContainer/Algorithmes';
import Algorithme from '../../screens/algorithmesContainer/Algorithme';
import Settings from '../../screens/settings/';

const Stack = createStackNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Votre espace personnel',
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
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Vos cas médical',
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
  Algorithmes: {
    screen: Algorithmes,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Algorithmes disponible',
      };
    },
  },
  Algorithme: {
    screen: Algorithme,
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

export default createDrawerNavigator(
  {
    Home: { screen: Stack },
  },
  {
    contentComponent: (props) => <Drawer {...props} />,
  }
);
