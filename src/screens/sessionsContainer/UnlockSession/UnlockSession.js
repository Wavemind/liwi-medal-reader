// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import * as _ from 'lodash';
import type { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { Button, Form, Text, View } from 'native-base';
import CustomInput from '../../../components/InputContainer/CustomInput';
import i18n from '../../../utils/i18n';
import { LiwiTitle2 } from '../../../template/layout';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import { styles } from './UnlockSession.style';


type Props = NavigationScreenProps & { sessions: SessionsProviderState };
type State = {
  email: string,
  code: string,
  session: Object,
};

export default class UnlockSession extends React.Component<Props, State> {
  state = {
    email: __DEV__ ? 'mickael.lacombe@wavemind.ch' : '',
    code: __DEV__ ? '123456q' : '',
    session: {},
  };


  // Update value of email when user typing
  changeEmail = (val: string) => {
    console.log(val)
    this.setState({ email: val });
  };

  // Save value of code in state
  changeCode = (val: string) => {
    this.setState({ code: val });
  };

  // Send to context code and session for verification
  unLock = () => {
    const { code, email } = this.state;
    const { app, sessions: { sessions } } = this.props;

    let result = _.find(sessions, (session) => {
      console.log(email)
      console.log(session.data.email === email);
      return session.data.email === email;
    });

    console.log(result);

    // app.unLockSession(session.data.id, code);
  };

  render() {
    const { email, code } = this.state;

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
            <LiwiTitle2 noBorder center>{i18n.t('unlock_session:title')}</LiwiTitle2>
            <Form>
              <CustomInput
                init={email}
                change={this.changeEmail}
                index={this}
                placeholder={i18n.t('unlock_session:email')}
                condensed={true}
              />
              <CustomInput
                init={code}
                change={this.changeCode}
                secureTextEntry={true}
                placeholder={i18n.t('unlock_session:code')}
                condensed={true}
              />
            </Form>
            <Button
              full
              onPress={this.unLock}
              styles={styles.button}
            >
              <Text>{i18n.t('unlock_session:unlock')}</Text>
            </Button>
          </ScrollView>
        </View>
      </View>
    );
  }
}
