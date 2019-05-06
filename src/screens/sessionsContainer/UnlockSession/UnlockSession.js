// @flow

import * as React from 'react';
import { PaddedView } from '../../../template/layout';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import { styles } from './UnlockSession.style';
import type { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { Button, Form, Input, Item, Label, Text, View } from 'native-base';

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

  // Save value of code in state
  changeCode = (val: string) => {
    this.setState({ code: val });
  };

  // Send to context code and session for verification
  unLock = () => {
    const { session, code } = this.state;
    const { app } = this.props;
    app.unlockSession(session.data.id, code);
  };

  render() {
    const { code } = this.state;

    return (
      <PaddedView style={styles.container}>
        <LottieView
          source={require('../../../utils/animations/unlock.json')}
          autoPlay
          style={styles.height}
          loop
        />
        <View style={styles.view}>
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
        </View>
      </PaddedView>
    );
  }
}
