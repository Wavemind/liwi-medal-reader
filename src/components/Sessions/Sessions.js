// @flow

import * as React from 'react';
import { Button, Icon, Text } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';

type Props = NavigationScreenProps & {
  sessions: SessionsProviderState,
  t: void,
};

type State = {};

export default class Sessions extends React.Component<Props, State> {
  state = {};

  onClickSession = async (session: Object) => {
    const { navigation } = this.props;
    const sessionLocalStorage = await getSession(session.data.id);

    // Redirect the user to make him define his local password if he had not done it yet.
    if (sessionLocalStorage.local_code === undefined) {
      navigation.navigate('SetCodeSession', {
        user_id: session.data.id,
      });
    } else {
      navigation.navigate('UnlockSession', {
        user_id: session.data.id,
        title: `${session.data.first_name} ${session.data.last_name}`,
      });
    }
    return false;
  };

  render() {
    const {
      sessions: { sessions },
      t,
    } = this.props;

    return (
      <React.Fragment>
        <Text>{sessions.length > 0 ? t('active') : t('empty')}</Text>
        {sessions.map((session) => (
          <Button
            iconLeft
            key={session.data.id}
            onPress={() => this.onClickSession(session)}
          >
            <Icon type={'Ionicons'} name="md-person" />
            <Text>
              {session.data.first_name} {session.data.last_name}
            </Text>
          </Button>
        ))}
      </React.Fragment>
    );
  }
}
