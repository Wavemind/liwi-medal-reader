// @flow

import * as React from 'react';
import { Button, Form, Input, Item, Label, Text, View } from 'native-base';
import { sha256 } from 'js-sha256';
import type { NavigationScreenProps } from 'react-navigation';
import {
  liwiColors,
  saltHash,
  screenHeight,
  screenWidth,
} from '../../../utils/constants';
import type { SessionsProviderState } from '../../../engine/contexts/Sessions.context';
import { getSession } from '../../../engine/api/LocalStorage';
import { LiwiTitle2 } from '../../../template/layout';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native';

type Props = NavigationScreenProps & { sessions: SessionsProviderState };

type State = {
  codeOne: string,
  codeTwo: string,
  error: boolean,
  success: boolean,
};

export default class SetCodeSession extends React.Component<Props, State> {
  state = {
    codeOne: __DEV__ ? '123456q' : '',
    codeTwo: __DEV__ ? '123456q' : '',
    error: false,
    success: false,
    session: null,
  };

  async componentWillMount() {
    let session = await getSession(this.props.navigation.getParam('user_id'));
    this.setState({ session });
    this.isTheSame();
  }

  changeCodeOne = (val: string) => {
    this.setState({ codeOne: val }, () => this.isTheSame());
  };

  changeCodeTwo = (val: string) => {
    this.setState({ codeTwo: val }, () => this.isTheSame());
  };

  isTheSame = () => {
    const { codeOne, codeTwo } = this.state;
    var mediumRegex = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
    );

    if (codeOne.length > 0 && codeTwo.length > 0) {
      let encrypt1 = sha256.hmac(saltHash, codeOne);
      let encrypt2 = sha256.hmac(saltHash, codeTwo);
      if (encrypt1 !== encrypt2) {
        this.setState({ error: true, success: false });
      } else if (mediumRegex.test(codeOne) && mediumRegex.test(codeTwo)) {
        this.setState({ success: true, error: false });
      }
    }
  };

  setLocalCode = async () => {
    const { codeOne } = this.state;
    const { navigation, sessions, app } = this.props;
    const userId = navigation.getParam('user_id');
    const encrypted = sha256.hmac(saltHash, codeOne);

    await sessions.setLocalCode(encrypted, userId);

    app.unlockSession(userId, codeOne);
    //
    // navigation.navigate('UnlockSession', {
    //   user_id: session.data.id,
    //   title: `${session.data.first_name} ${session.data.last_name}`,
    // });

    //navigation.navigate('SignIn');
  };

  render() {
    const { codeOne, codeTwo, error, success, session } = this.state;

    if (session === null) {
      return null;
    }

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <LottieView
          source={require('../../../utils/animations/welcome.json')}
          autoPlay
          style={{
            height: 300,
          }}
          loop
        />
        <View
          style={{
            width: screenWidth * 0.8,
            borderColor: liwiColors.redColor,
            borderWidth: 2,
            borderRadius: 10,
            padding: 30,
          }}
        >
          <LiwiTitle2>
            Bienvenue {session.data.first_name} {session.data.last_name}
          </LiwiTitle2>
          <Form>
            <Item success={success} error={error} login-input floatingLabel>
              <Label>Votre code</Label>
              <Input
                onChangeText={this.changeCodeOne}
                value={codeOne}
                textContentType="emailAddress"
                secureTextEntry
              />
            </Item>
            <Item success={success} error={error} login-input floatingLabel>
              <Label>Retaper votre code</Label>
              <Input
                onChangeText={this.changeCodeTwo}
                value={codeTwo}
                secureTextEntry
              />
            </Item>
            {error ? (
              <React.Fragment>
                <Text padded error>
                  - Minimum 6 caractères
                </Text>
                <Text padded error>
                  - Au moins une lettre et un chiffre
                </Text>
              </React.Fragment>
            ) : null}
          </Form>
          <Button
            style={{ marginTop: 20 }}
            onPress={() => this.setLocalCode()}
            disabled={success !== true}
          >
            <Text> Définir ce code </Text>
          </Button>
        </View>
      </View>
    );
  }
}
