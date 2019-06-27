// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import type { I18nTypes } from '../../../utils/i18n';
import UnlockSession from '../UnlockSession.screen';

type Props = NavigationScreenProps & {
  logged: boolean,
  t: I18nTypes,
  app: {
    authentication: (email: string, password: string) => void,
  },
};
type State = {};

export default class RootSessions extends React.Component<Props, State> {
  state = {};

  render() {
    const { navigation } = this.props;

    return (
      <UnlockSession navigation={navigation} />
    );
  }
}
