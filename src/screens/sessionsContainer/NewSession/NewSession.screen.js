// @flow

import * as React from 'react';
import { Button, Form, Input, Item, Label, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import {
  liwiColors,
  screenHeight,
  screenWidth,
} from '../../../utils/constants';
import { ToastFactory } from '../../../utils/ToastFactory';

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

    await sessions
      .newSession(email, password)
      .then(async (data) => {
        console.log(data);
        if (typeof data.uid === 'string') {
          this.setState({ success: true, loading: false, id: data.data.id });
        }

        if (data === false) {
          this.setState({ success: false, loading: false });
        }
      })
      .catch((err) => {
        ToastFactory(err, { type: 'danger' });
        this.setState({ success: false, loading: false });
      });
  };

  render() {
    const { email, password, loading, success, id } = this.state;
    const { navigation } = this.props;

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: screenWidth * 0.8,
            borderColor: liwiColors.redColor,
            borderWidth: 2,
            borderRadius: 10,
            padding: 30,
            marginTop: screenHeight * 0.27,
            marginBottom: 50,
          }}
        >
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
            style={{ marginTop: 20 }}
            onPress={() => this.authenticate()}
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
            style={{
              height: 200,
            }}
            loop
          />
        ) : null}
        {success ? (
          <LottieView
            speed={0.5}
            source={require('../../../utils/animations/done.json')}
            autoPlay
            loop={false}
            style={{
              height: 200,
            }}
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
