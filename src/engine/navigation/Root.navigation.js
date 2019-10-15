import NewSession from 'screens/sessionsContainer/NewSession';
import UnlockSession from 'screens/sessionsContainer/UnlockSession';
import SetCodeSession from 'screens/sessionsContainer/SetCodeSession';

import { createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './Main.navigation';
import Emergency from '../../screens/Emergency';
import i18n from '../../utils/i18n';

const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      Main: {
        screen: MainTabNavigator(),
      },
      Emergency: {
        screen: Emergency,
        params: {},
        navigationOptions: () => {
          return {
            title: i18n.t('navigation:emergency'),
          };
        },
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
