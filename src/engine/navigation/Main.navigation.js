import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import MedicalCases from '../../screens/medicalCases';
import MedicalCase from '../../screens/medicalCase';
import RootAlgorithmes from '../../screens/algorithme/RootAlgorithmes';
import Algorithme from '../../screens/algorithme/DetailAlgorithme';

const Stack = createStackNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Main page',
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
    screen: Algorithme,
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
