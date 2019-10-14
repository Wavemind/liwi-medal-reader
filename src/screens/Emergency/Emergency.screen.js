// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Content, Text, View } from 'native-base';
import { BackHandler, Image } from 'react-native';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Emergency.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Emergency extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  // Watch event for backbutton click
  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  // Catch back button click OR click button in view
  handleBackButtonClick() {
    const {
      app: { logged },
      navigation,
    } = this.props;

    // IF logged go to back
    if (logged) {
      navigation.goBack(null);
    } else {
      // Else go to Unlock
      navigation.navigate('UnlockSession');
    }
    return true;
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
          <Button
            onPress={() => {
              this.handleBackButtonClick();
            }}
          >
            <Text>{t('emergency:back')}</Text>
          </Button>
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
