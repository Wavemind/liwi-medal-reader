import NewSession from 'screens/sessionsContainer/NewSession';
import UnlockSession from 'screens/sessionsContainer/UnlockSession';
import SetCodeSession from 'screens/sessionsContainer/SetCodeSession';

import { createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './Main.navigation';

const createRootNavigator = (signedIn = false, medicalCase = null) => {
  return createSwitchNavigator(
    {
      Main: {
        screen: MainTabNavigator(medicalCase),
      },
      UnlockSession: {
        screen: UnlockSession,
      },
      NewSession: {
        screen: NewSession,
      },
      SetCodeSession: {
        screen: SetCodeSession,
      },
    },
    {
      initialRouteName: signedIn ? 'Main' : 'UnlockSession',
    }
  );
};

export default createRootNavigator;
