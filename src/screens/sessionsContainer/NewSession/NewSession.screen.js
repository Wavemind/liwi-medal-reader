// @flow

import * as React from 'react';
import LottieView from 'lottie-react-native';
import { Button, Form, Picker, Text, View, List, ListItem, Left, Right } from 'native-base';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import { styles } from './NewSession.style';
import CustomInput from '../../../components/InputContainer/CustomInput';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';
import { getItem, setItem } from '../../../engine/api/LocalStorage';

export default function HookSession() {
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState(__DEV__ ? 'alain.fresco@wavemind.ch' : '');
  const [password, setPassword] = React.useState(__DEV__ ? '123456' : '');
  const [success, setSuccess] = React.useState(false);
  const [environment, setEnvironment] = React.useState(null);
  const app = React.useContext(ApplicationContext);
  const { isConnected, t } = app;

  React.useEffect(() => {
    const fetchEnvironment = async () => {
      const storedEnvironment = await getItem('environment');
      if (storedEnvironment === null) {
        if (__DEV__) {
          setEnvironment('test');
        } else {
          setEnvironment('production');
        }
      } else {
        setEnvironment(storedEnvironment);
      }
      setLoading(false);
    };

    fetchEnvironment();
  }, []);

  const signIn = async () => {
    if (email.length < 5 || password.length < 3) {
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
              <List>
                <ListItem style={styles.listItem}>
                  <Left>
                    <Text>{t('settings:environment')}</Text>
                  </Left>
                  <Right>
                    <View style={styles.picker}>
                      <Picker
                        mode="dropdown"
                        selectedValue={environment}
                        onValueChange={async (value) => {
                          await setItem('environment', value);
                          await AsyncStorage.removeItem('session');
                          await AsyncStorage.removeItem('user');
                          NavigationService.navigate('NewSession');
                          await RNRestart.Restart();
                        }}
                      >
                        <Picker.Item label="Production" value="production" />
                        <Picker.Item label="Test" value="test" />
                        <Picker.Item label="Staging" value="staging" />
                      </Picker>
                    </View>
                  </Right>
                </ListItem>
              </List>
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
                NavigationService.navigate('Synchronize');
              }}
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
