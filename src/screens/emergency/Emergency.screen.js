// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Content, Text, View } from 'native-base';
import { Image } from 'react-native';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Emergency.style';

type Props = NavigationScreenProps & {};

type State = {};

// eslint-disable-next-line react/prefer-stateless-function
export default class Emergency extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      app: { t },
    } = this.props;

    return (
      <Content>
        <View style={styles.view}>
          <LiwiTitle2>{t('emergency:emergency')}</LiwiTitle2>
          <Text>
            This page has been created to provide emergency assistance in case
            of need
          </Text>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={require('../../../assets/images/emergency.jpg')}
          />
        </View>
      </Content>
    );
  }
}
