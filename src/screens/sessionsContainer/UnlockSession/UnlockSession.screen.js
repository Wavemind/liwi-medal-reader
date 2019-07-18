// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import * as _ from 'lodash';
import type { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { Button, Form, Text, View } from 'native-base';
import CustomInput from '../../../components/InputContainer/CustomInput';
import { LiwiTitle2 } from '../../../template/layout';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import { styles } from './UnlockSession.style';

type Props = NavigationScreenProps & { sessions: SessionsProviderState };
type State = {
  email: string,
  code: string,
  session: Object,
  errors: Object,
};

export default class UnlockSession extends React.Component<Props, State> {
  state = {
    email: __DEV__ ? 'mickael.lacombe@wavemind.ch' : '',
    code: __DEV__ ? '123456q' : '',
    errors: null,
  };

  changeValueFromInput = (index, value) => {
    this.setState({ [index]: value });
  };

  // Navigate to new session screen
  newSessionScreen = () => {
    const { navigation } = this.props;
    navigation.navigate('NewSession');
  };

  // Send to context code and session for verification
  unLock = async () => {
    const { code, email } = this.state;
    const {
      app,
      app: { t },
      sessions: { sessions },
    } = this.props;

    let user = _.find(sessions, (session) => {
      return session.data.email === email;
    });

    if (user !== undefined) {
      let result = await app.unLockSession(user.data.id, code);
      this.setState({ errors: t(`notifications:${result}`) });
    } else {
      this.setState({ errors: t('notifications:session_does_not_exist') });
    }
  };

  render() {
    const { email, code, errors } = this.state;

    const {
      app: { isConnected, t },
    } = this.props;

    return (
      <View flex-container-column>
        <View margin-auto padding-auto>
          <ScrollView>
            <LottieView
              source={require('../../../utils/animations/unlock.json')}
              autoPlay
              style={styles.lottie}
              loop
            />
            <LiwiTitle2 noBorder center>
              {t('unlock_session:title')}
            </LiwiTitle2>
            <Form>
              <CustomInput
                init={email}
                change={this.changeValueFromInput}
                index='email'
                placeholder={t('unlock_session:email')}
                condensed
                error={errors}
              />
              <CustomInput
                init={code}
                index='code'
                change={this.changeValueFromInput}
                secureTextEntry
                placeholder={t('unlock_session:code')}
                condensed
              />
            </Form>
            <Button full onPress={this.unLock} style={styles.button}>
              <Text>{t('unlock_session:unlock')}</Text>
            </Button>
          </ScrollView>
        </View>
        <View bottom-view margin-auto padding-auto>
          <View>
            <Button onPress={this.newSessionScreen} disabled={!isConnected} testID='new_session'>
              <Text>{t('unlock_session:new_session')}</Text>
            </Button>
            {!isConnected ? (
              <Text>{t('notifications:no_internet')}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}
