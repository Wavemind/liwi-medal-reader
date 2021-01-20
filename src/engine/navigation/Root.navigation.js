import { createSwitchNavigator } from 'react-navigation';

import NewSession from '../../screens/sessionsContainer/NewSession';
import UnlockSession from '../../screens/sessionsContainer/UnlockSession';
import UserSelection from '../../screens/sessionsContainer/UserSelection';
import Synchronize from '../../screens/sessionsContainer/Synchronize';
import About from '../../screens/sessionsContainer/About';

import Loading from '../../screens/loading';
import MainTabNavigator from './Main.navigation';

export const RootMainNavigator = createSwitchNavigator(
  {
    AuthLoading: Loading,
    App: MainTabNavigator(),
    NewSession: { screen: NewSession },
    UserSelection: { screen: UserSelection },
    UnlockSession: { screen: UnlockSession },
    Synchronize: { screen: Synchronize },
    About: { screen: About },
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
