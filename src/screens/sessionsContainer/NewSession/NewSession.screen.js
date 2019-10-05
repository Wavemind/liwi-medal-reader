// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { Button, Form, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import { styles } from './NewSession.style';
import CustomInput from '../../../components/InputContainer/CustomInput';
import { LiwiTitle2 } from '../../../template/layout';

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

  changeValueFromInput = (index, value) => {
    this.setState({ [index]: value });
  };

  // Navigate to unlock session screen
  unLockSessionScreen = () => {
    const { navigation } = this.props;
    navigation.navigate('UnlockSession');
  };

  // Authentication method
  signIn = async () => {
    const { email, password } = this.state;

    if (email.length < 8 || password.length < 3) {
      return null;
    }

    this.setState({ loading: true });
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
      .catch(() => {
        this.setState({ success: false, loading: false });
      });
  };

  render() {
    const { email, password, loading, success, id } = this.state;

    const {
      navigation,
      app: { isConnected, t },
    } = this.props;

    if (success) {
      setTimeout(() => {
        navigation.navigate('SetCodeSession', {
          user_id: id,
        });
      }, 3000);
    }

    return (
      <View flex-container-column>
        <View margin-auto style={styles.centerVertically} padding-auto>
          <ScrollView>
            <LiwiTitle2 noBorder center>
              {t('new_session:title')}
            </LiwiTitle2>
            <Form>
              <CustomInput
                init={email}
                change={this.changeValueFromInput}
                index="email"
                placeholder={t('email')}
                condensed
                keyboardType="email"
              />
              <CustomInput
                init={password}
                change={this.changeValueFromInput}
                index="password"
                placeholder={t('password')}
                secureTextEntry
                condensed
              />
              <Button
                testID="connect_main"
                full
                style={styles.marginTop}
                onPress={() => this.signIn()}
                disabled={loading || success || !isConnected}
              >
                <Text> {t('connect')} </Text>
              </Button>
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
        <View bottom-view margin-auto padding-auto>
          <Button onPress={this.unLockSessionScreen}>
            <Text>{t('new_session:unlock_session')}</Text>
          </Button>
        </View>
      </View>
    );
  }
}
