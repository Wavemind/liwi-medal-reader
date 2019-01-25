import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import MainTabNavigator from './Main.navigation';
import RootSessions from '../../screens/session/RootSessions';
import NewSession from 'screens/session/NewSession';
import UnlockSession from 'screens/session/UnlockSession';
import SetCodeSession from 'screens/session/SetCodeSession';

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
