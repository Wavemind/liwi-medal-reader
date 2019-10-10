// @flow

import * as React from 'react';
import { sha256 } from 'js-sha256';
import type { NavigationScreenProps } from 'react-navigation';
import { Button, Form, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import { getSession } from '../../../engine/api/LocalStorage';
import { LiwiTitle2 } from '../../../template/layout';
import { styles } from './SetCodeSession.style';
import { saltHash } from '../../../../frontend_service/constants';
import CustomInput from '../../../components/InputContainer/CustomInput';

type Props = NavigationScreenProps & { sessions: SessionsProviderState };
type State = {
  code: string,
  codeConfirmation: string,
  error: string,
};

export default class SetCodeSession extends React.Component<Props, State> {
  state = {
    code: __DEV__ ? '123456q' : '',
    codeConfirmation: __DEV__ ? '123456q' : '',
    error: null,
    session: null,
    isLoading: false,
  };

  async componentWillMount() {
    const { navigation } = this.props;
    let session = await getSession(navigation.getParam('user_id'));
    this.setState({ session });
    // this.validateCode();
  }

  changeValueFromInput = (index, value) => {
    this.setState({ [index]: value });
  };

  // Validation of code
  validateCode = () => {
    const { code, codeConfirmation } = this.state;

    let mediumRegex = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
    );

    if (code.length > 0 && codeConfirmation.length > 0) {
      let encrypt1 = sha256.hmac(saltHash, code);
      let encrypt2 = sha256.hmac(saltHash, codeConfirmation);

      if (
        encrypt1 !== encrypt2 ||
        (!mediumRegex.test(code) && !mediumRegex.test(codeConfirmation))
      ) {
        this.setState({
          error: "Your password is too weak or it's not the same",
        });
        return false;
      }

      return true;
    }
  };

  // Save code in session
  setLocalCode = async () => {
    this.setState({ isLoading: true });
    let result = await this.validateCode();

    if (result) {
      const { code } = this.state;
      const { navigation, sessions, app } = this.props;
      const userId = navigation.getParam('user_id');
      const encrypted = sha256.hmac(saltHash, code);

      await sessions.setLocalCode(encrypted, userId);
      app.unLockSession(userId, code);
    } else {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { code, codeConfirmation, session, error, isLoading } = this.state;
    const {
      app: { t },
    } = this.props;

    if (session === null) {
      return null;
    }

    return (
      <View flex-container-column>
        <View margin-auto style={styles.centerVertically} padding-auto>
          <ScrollView>
            <LiwiTitle2 noBorder testID="welcome">
              {t('code_session_screen:title')} {session.data.first_name}{' '}
              {session.data.last_name}
            </LiwiTitle2>
            <Form>
              <CustomInput
                init={code}
                change={this.changeValueFromInput}
                index="code"
                secureTextEntry
                placeholder={t('code_session_screen:your_code')}
                condensed
                error={error}
              />
              <CustomInput
                init={codeConfirmation}
                change={this.changeValueFromInput}
                index="codeConfirmation"
                secureTextEntry
                placeholder={t('code_session_screen:type_your_code')}
                condensed
              />
              <Button
                testID="set_code"
                full
                style={styles.marginTop}
                onPress={() => this.setLocalCode()}
                disabled={isLoading}
              >
                <Text> {t('code_session_screen:set_code')} </Text>
              </Button>
            </Form>
          </ScrollView>
        </View>
      </View>
    );
  }
}
