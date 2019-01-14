// @flow

import * as React from 'react';
import { Button, Container, Content, Icon, Text, View } from 'native-base';
import { AppState, Image, ImageBackground, ScrollView } from 'react-native';
import { postDeviceInfo } from '../../../engine/api/Http';
import { styles } from './RootSessions.styles';
import Sessions from '../../../components/Sessions';
import type { I18nTypes } from '../../../utils/i18n';
import { NavigationScreenProps } from 'react-navigation';
import { clearLocalStorage } from 'engine/api/LocalStorage';
import { Fragment } from 'react';

type Props = NavigationScreenProps & {
  logged: boolean,
  t: I18nTypes,
  app: {
    authentication: (email: string, password: string) => void,
  },
};

type State = {};

export default class RootSessions extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      navigation,
      t,
      app: { isConnected },
      sessions,
    } = this.props;

    return (
      <Fragment>
        <View style={styles.header}>
          <ImageBackground
            source={require('../../../../assets/images/tropical.png')}
            style={styles.backgroundImage}
          >
            <View style={styles.contentLogo}>
              <Image
                source={require('../../../../assets/images/icon.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
            </View>
          </ImageBackground>
        </View>
        <Container style={styles.container}>
          <Content contentContainerStyle={styles.content}>
            <Sessions navigation={navigation} />
            <Text>Tools</Text>
            <Button
              disabled={!isConnected}
              iconLeft
              style={!isConnected ? { backgroundColor: '#69635f' } : {}}
              blue
              onPress={() => navigation.push('NewSession')}
            >
              {!isConnected ? (
                <Icon type={'MaterialCommunityIcons'} name="lan-disconnect" />
              ) : (
                <Icon type={'Feather'} name="user-plus" />
              )}

              <Text> {t('add_account')} </Text>
            </Button>
            <Button
              iconLeft
              blue
              onPress={() => {
                postDeviceInfo();
              }}
            >
              <Icon type={'Octicons'} name="device-mobile" />
              <Text>{t('send_device_info')}</Text>
            </Button>
            <Button
              iconLeft
              blue
              onPress={async () => {
                await clearLocalStorage('sessions');
                await sessions.initContext();
              }}
            >
              <Icon type={'MaterialCommunityIcons'} name="delete-forever" />
              <Text>{t('clear_sessions')}</Text>
            </Button>
          </Content>
        </Container>
      </Fragment>
    );
  }
}
