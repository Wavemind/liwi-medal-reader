// @flow

import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Item,
  Label,
  Text,
  View,
  Spinner,
} from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps & {};

type State = {
  email: string,
  loading: boolean,
  password: string,
};

export default class NewSession extends React.Component<Props, State> {
  state = {
    email: __DEV__ ? 'mickael.lacombe@wavemind.ch' : '',
    password: __DEV__ ? '123456' : '',
    loading: false,
  };

  componentDidMount() {
    // this.setState({ email: 'mickael.lacombe@wavemind.ch', password: '123456' });
  }

  changeEmail = (val: string) => {
    this.setState({ email: val });
  };

  changePassword = (val: string) => {
    this.setState({ password: val });
  };

  authenticate = async () => {
    this.setState({ loading: true });
    const { email, password } = this.state;
    const { sessions, navigation } = this.props;
    const newSession = await sessions.newSession(email, password);
    if (typeof newSession === 'number') {
      navigation.navigate('SetCodeSession', {
        user_id: newSession,
      });
    }
    this.setState({ loading: false });
  };

  render() {
    const { email, password, loading } = this.state;

    return (
      <View>
        <Form>
          <Item login-input floatingLabel>
            <Label>Email</Label>
            <Input
              onChangeText={this.changeEmail}
              value={email}
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          </Item>
          <Item login-input floatingLabel>
            <Label>Password</Label>
            <Input
              onChangeText={this.changePassword}
              value={password}
              secureTextEntry
            />
          </Item>
        </Form>
        <Button onPress={() => this.authenticate()}>
          {loading ? <Spinner color="white" /> : null}
          <Text> Try to login </Text>
        </Button>
      </View>
    );
  }
}
