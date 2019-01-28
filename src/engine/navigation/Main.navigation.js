import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Button, Icon, Text } from 'native-base';

import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import MedicalCases from '../../screens/medicalCases';
import MedicalCase from '../../screens/medicalCase';
import RootAlgorithmes from '../../screens/algorithme/RootAlgorithmes';
import DetailAlgorithme from '../../screens/algorithme/DetailAlgorithme';

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
    screen: RootAlgorithmes,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Algorithmes disponible',
      };
    },
  },
  DetailAlgorithme: {
    screen: DetailAlgorithme,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
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
