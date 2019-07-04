// @flow

import * as React from 'react';
import { Fragment } from 'react';
import { styles } from './RootSessions.styles';
import { NavigationScreenProps } from 'react-navigation';
import type { I18nTypes } from '../../../utils/i18n';
import {  View } from 'native-base';
import { Image, ImageBackground } from 'react-native';
import NewSession from '../NewSession';
import Sessions from '../../../components/Sessions';

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
      app: { t },
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
        <Sessions navigation={navigation} />
        <NewSession navigation={navigation} />
      </Fragment>
    );
  }
}
