// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { styles } from './NewSession.style';
import {
  Button,
  Form,
  Input,
  Item,
  Label,
  Text,
  View,
  Icon,
} from 'native-base';
import { Keyboard, ScrollView } from 'react-native';

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
    keyboard: false,
    connectionMethod: 'server',
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ keyboard: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboard: false });
  };

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
      .then((data) => {
        if (typeof data.uid === 'string') {
          this.setState({ success: true, loading: false, id: data.data.id });
        }

        if (data === false) {
          this.setState({ success: false, loading: false });
        }
      })
      .catch((err) => {
        this.setState({ success: false, loading: false });
      });
  };

  changeConnection = (connectionMethod) => this.setState({ connectionMethod });

  render() {
    const {
      email,
      password,
      loading,
      success,
      id,
      keyboard,
      connectionMethod,
    } = this.state;

    const {
      navigation,
      t,
      app: { isConnected },
    } = this.props;

    return (
      <View flex-container-column>
        <View border-primary margin-auto padding-auto>
          <ScrollView>
            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  login-input
                  onChangeText={this.changeEmail}
                  value={email}
                  textContentType="emailAddress"
                  keyboardType="email-address"
                />
              </Item>
              <Item floatingLabel>
                <Label>{t('password')}</Label>
                <Input
                  login-input
                  onChangeText={this.changePassword}
                  value={password}
                  secureTextEntry
                />
              </Item>
              <Button
                full
                style={styles.marginTop}
                onPress={() => this.signIn()}
                disabled={loading || success}
              >
                <Text> {t('login')} </Text>
              </Button>
              <View w50>
                <Button
                  center
                  w50
                  style={styles.marginTop}
                  onPress={() => this.changeConnection('server')}
                  disabled={loading || success || !isConnected}
                  switch-login
                  activeStyle={connectionMethod === 'server'}
                >
                  <Icon
                    grey
                    type={'MaterialCommunityIcons'}
                    name="lan-connect"
                  />
                  <Text dark> {t('server')} </Text>
                </Button>
                <Button
                  center
                  w50
                  style={styles.marginTop}
                  onPress={() => this.changeConnection('local')}
                  disabled={loading || success}
                  switch-login
                  activeStyle={connectionMethod === 'local'}
                >
                  <Icon
                    grey
                    type={'MaterialCommunityIcons'}
                    name="lan-disconnect"
                  />
                  <Text dark> {t('local')} </Text>
                </Button>
              </View>
            </Form>
          </ScrollView>
        </View>
        <View flex-center>
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
      </View>
    );
  }
}
