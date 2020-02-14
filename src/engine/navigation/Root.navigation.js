import NewSession from 'screens/sessionsContainer/NewSession';
import UnlockSession from 'screens/sessionsContainer/UnlockSession';
import SetCodeSession from 'screens/sessionsContainer/SetCodeSession';

import { createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './Main.navigation';

export const RootMainNavigator = createSwitchNavigator({
  Main: {
    screen: MainTabNavigator(),
  },
});

export const RootLoginNavigator = createSwitchNavigator({
  UnlockSession: {
    screen: UnlockSession,
  },
  NewSession: {
    screen: NewSession,
  },
  SetCodeSession: {
    screen: SetCodeSession,
  },
});
