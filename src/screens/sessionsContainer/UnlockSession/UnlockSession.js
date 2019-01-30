// @flow

import * as React from 'react';
import { Button, Form, Input, Item, Label, Text } from 'native-base';
import { PaddedView } from '../../../template/layout';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import type { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps & { sessions: SessionsProviderState };

type State = {
  code: string,
  session: Object,
};

export default class UnlockSession extends React.Component<Props, State> {
  state = { code: __DEV__ ? '123456q' : '', session: {} };

  componentWillMount() {
    const {
      navigation,
      sessions: { sessions },
    } = this.props;

    const userId = navigation.getParam('user_id');
    const session = sessions.find((item) => item.data.id === userId);
    this.setState({ session });
  }

  changeCode = (val: string) => {
    this.setState({ code: val });
  };

  unLock = () => {
    const { session, code } = this.state;
    const { app } = this.props;
    app.unlockSession(session.data.id, code);
  };

  render() {
    const { code } = this.state;

    return (
      <PaddedView>
        <Form>
          <Item login-input floatingLabel>
            <Label>Code</Label>
            <Input
              onChangeText={this.changeCode}
              value={code}
              secureTextEntry
            />
          </Item>
        </Form>
        <Button onPress={this.unLock}>
          <Text> Dévérouiller la session </Text>
        </Button>
      </PaddedView>
    );
  }
}
