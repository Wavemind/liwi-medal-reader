// @flow

import * as React from 'react';
import LottieView from 'lottie-react-native';
import { Button, Form, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import { styles } from './NewSession.style';
import CustomInput from '../../../components/InputContainer/CustomInput';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';

export default function HookSession() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState(__DEV__ ? 'alain.fresco@wavemind.ch' : '');
  const [password, setPassword] = React.useState(__DEV__ ? '123456' : '');
  const [success, setSuccess] = React.useState(false);
  const app = React.useContext(ApplicationContext);
  const { isConnected, t } = app;

  const signIn = async () => {
    if (email.length < 8 || password.length < 3) {
      return null;
    }

    setLoading(true);
    setSuccess(await app.newSession(email, password));
    setLoading(false);
  };

  return (
    <ScrollView>
      <View flex-container-column testID="new_session">
        <View margin-auto style={styles.centerVertically} padding-auto>
          <ScrollView>
            <Text bigTitle>{t('new_session:title')}</Text>
            <Form>
              <CustomInput init={email} change={(index, value) => setEmail(value)} index="email" placeholder={t('email')} condensed keyboardType="email-address" />
              <CustomInput init={password} change={(index, value) => setPassword(value)} index="password" placeholder={t('password')} secureTextEntry condensed />
              <Button testID="connect_main" full style={styles.marginTop} onPress={() => signIn()} disabled={loading || success || !isConnected}>
                <Text> {t('new_session:connect')} </Text>
              </Button>
            </Form>
          </ScrollView>
        </View>
        <View flex-center>
          {loading ? <LiwiLoader style={styles.height} /> : null}
          {success ? (
            <LottieView
              speed={0.5}
              source={require('../../../utils/animations/done.json')}
              autoPlay
              loop={false}
              style={styles.height}
              onAnimationFinish={() => {
                NavigationService.navigate('Synchronise');
              }}
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
