import NewSession from 'screens/sessionsContainer/NewSession';
import UnlockSession from 'screens/sessionsContainer/UnlockSession';

import { createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './Main.navigation';
import UserSelection from '../../screens/sessionsContainer/UserSelection';

export const RootMainNavigator = createSwitchNavigator({
  Main: {
    screen: MainTabNavigator(),
  },
});

export const RootLoginNavigator = (routeName) =>
  createSwitchNavigator(
    {
      NewSession: {
        screen: NewSession,
      },
      UnlockSession: {
        screen: UnlockSession,
      },
      UserSelection: {
        screen: UserSelection,
      },
    },
    {
      initialRouteName: routeName,
    }
  );
