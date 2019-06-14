// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { sha256 } from 'js-sha256';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import { getSession } from '../../../engine/api/LocalStorage';
import { LiwiTitle2 } from '../../../template/layout';
import { styles } from './SetCodeSession.style';
import { saltHash } from '../../../../frontend_service/constants';
import { Button, Form, Input, Item, Label, Text, View } from 'native-base';

type Props = NavigationScreenProps & { sessions: SessionsProviderState };
type State = {
  code: string,
  codeConfirmation: string,
  error: boolean,
  success: boolean,
};

export default class SetCodeSession extends React.Component<Props, State> {
  state = {
    code: __DEV__ ? '123456q' : '',
    codeConfirmation: __DEV__ ? '123456q' : '',
    error: false,
    success: false,
    session: null,
  };

  async componentWillMount() {
    let session = await getSession(this.props.navigation.getParam('user_id'));
    this.setState({ session });
    this.isTheSame();
  }

  // Save value of code in state
  changeCode = (val: string) => {
    this.setState({ code: val }, () => this.isTheSame());
  };

  // Save value of code confirmation in state
  changeCodeConfirmation = (val: string) => {
    this.setState({ codeConfirmation: val }, () => this.isTheSame());
  };

  // Verify if codes are same
  isTheSame = () => {
    const { code, codeConfirmation } = this.state;

    let mediumRegex = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
    );

    if (code.length > 0 && codeConfirmation.length > 0) {
      let encrypt1 = sha256.hmac(saltHash, code);
      let encrypt2 = sha256.hmac(saltHash, codeConfirmation);
      if (encrypt1 !== encrypt2) {
        this.setState({ error: true, success: false });
      } else if (mediumRegex.test(code) && mediumRegex.test(codeConfirmation)) {
        this.setState({ success: true, error: false });
      }
    }
  };

  // Save code in session
  setLocalCode = async () => {
    const { code } = this.state;
    const { navigation, sessions, app } = this.props;
    const userId = navigation.getParam('user_id');
    const encrypted = sha256.hmac(saltHash, code);

    await sessions.setLocalCode(encrypted, userId);

    app.unLockSession(userId, code);
  };

  render() {
    const { code, codeConfirmation, error, success, session } = this.state;
    const { t } = this.props;

    if (session === null) {
      return null;
    }

    return (
      <View flex-container-column>
        <View margin-auto padding-auto>
          <Form>
            <LiwiTitle2 noBorder>
              {t('welcome')} {session.data.first_name} {session.data.last_name}
            </LiwiTitle2>
            <Item success={success} error={error} login-input floatingLabel>
              <Label>{t('your_code')}</Label>
              <Input
                onChangeText={this.changeCode}
                value={code}
                textContentType="emailAddress"
                secureTextEntry
              />
            </Item>

            <Item success={success} error={error} login-input floatingLabel>
              <Label>{t('type_your_code')}</Label>
              <Input
                onChangeText={this.changeCodeConfirmation}
                value={codeConfirmation}
                secureTextEntry
              />
            </Item>
            {error ? (
              <React.Fragment>
                <Text padded error>
                  - {t('error_same')}
                </Text>
                <Text padded error>
                  - {t('error_char')}
                </Text>
                <Text padded error>
                  - {t('error_letter')}
                </Text>
              </React.Fragment>
            ) : null}
            <Button
              full
              style={styles.marginTop}
              onPress={() => this.setLocalCode()}
              disabled={success !== true}
            >
              <Text> {t('set_code')} </Text>
            </Button>
          </Form>
        </View>
      </View>
    );
  }
}
