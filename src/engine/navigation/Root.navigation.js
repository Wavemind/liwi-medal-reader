import MainTabNavigator from './Main.navigation';
import RootSessions from '../../screens/sessionsContainer/RootSessions';
import NewSession from 'screens/sessionsContainer/NewSession';
import UnlockSession from 'screens/sessionsContainer/UnlockSession';
import SetCodeSession from 'screens/sessionsContainer/SetCodeSession';

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

export const SignedOut = createStackNavigator( {
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
        title: navigation.getParam( 'title' ),
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
} );

const createRootNavigator = (signedIn = false, medicalCase = null) => {
  return createSwitchNavigator(
    {
      Main: {
        screen: MainTabNavigator( medicalCase ),
      },
      SignedOut: {
        screen: SignedOut,
      },
    },
    {
      initialRouteName: signedIn ? 'Main' : 'SignedOut',
    },
  );
};

export default createRootNavigator;
