import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';

import MainTabNavigator from './Main.navigation';
import RootSessions from '../../screens/session/RootSessions';
import NewSession from 'screens/session/NewSession';
import UnlockSession from 'screens/session/UnlockSession';
import SetCodeSession from 'screens/session/SetCodeSession';
import MedicalCases from '../../screens/medicalCases';

export const SignedOut = createStackNavigator({
  SignIn: {
    screen: RootSessions,
    navigationOptions: ({ navigation }) => {
      return {
        header: null,
        drawerLockMode: 'locked-closed',
      };
    },
  },
  NewSession: {
    screen: NewSession,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Nouvelle session',
      };
    },
  },
  UnlockSession: {
    screen: UnlockSession,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
      };
    },
  },
  SetCodeSession: {
    screen: SetCodeSession,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Code local',
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
});

const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      Main: {
        screen: MainTabNavigator,
      },
      SignedOut: {
        screen: SignedOut,
      },
    },
    {
      initialRouteName: signedIn ? 'Main' : 'SignedOut',
    }
  );
};

export default createRootNavigator;
