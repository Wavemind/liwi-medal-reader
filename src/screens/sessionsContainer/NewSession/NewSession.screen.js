// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { displayToast } from '../../../utils/CustomToast';
import { styles } from './NewSession.style';
import { Button, Form, Input, Item, Label, Text, View } from 'native-base';

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
    success: false,
    id: null,
  };

  componentDidMount() {
    // this.setState({ email: 'mickael.lacombe@wavemind.ch', password: '123456' });
  }

  // Update value of email when user typing
  changeEmail = (val: string) => {
    this.setState({ email: val });
  };

  // Update value of password when user typing
  changePassword = (val: string) => {
    this.setState({ password: val });
  };

  // Authentication method
  signIn = async () => {
    this.setState({ loading: true });
    const { email, password } = this.state;
    const { sessions } = this.props;

    await sessions
      .newSession(email, password)
      .then(async (data) => {
        if (typeof data.uid === 'string') {
          this.setState({ success: true, loading: false, id: data.data.id });
        }

        if (data === false) {
          this.setState({ success: false, loading: false });
        }
      })
      .catch((err) => {
        displayToast(err, { type: 'danger' });
        this.setState({ success: false, loading: false });
      });
  };

  render() {
    const { email, password, loading, success, id } = this.state;

    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
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
          <Button
            style={styles.marginTop}
            onPress={() => this.signIn()}
            disabled={loading || success}
          >
            <Text> Try to login </Text>
          </Button>
        </View>
        {loading ? (
          <LottieView
            speed={3}
            source={require('../../../utils/animations/loading.json')}
            autoPlay
            style={styles.height}
            loop
          />
        ) : null}
        {success ? (
          <LottieView
            speed={0.5}
            source={require('../../../utils/animations/done.json')}
            autoPlay
            loop={false}
            style={styles.height}
            onAnimationFinish={() => {
              navigation.navigate('SetCodeSession', {
                user_id: id,
              });
            }}
          />
        ) : null}
      </View>
    );
  }
}
