// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Content, Text, View, Button } from 'native-base';
import { Image, BackHandler } from 'react-native';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Urgence.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Urgence extends React.Component<Props, State> {
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
    return (
      <Content>
        <View style={styles.view}>
          <LiwiTitle2>Urgence Assistance</LiwiTitle2>
          <Text>
            This page has been created to provide emergency assistance in case
            of need
          </Text>
          <Button
            onPress={() => {
              this.handleBackButtonClick();
            }}
          >
            <Text>Go back to Home</Text>
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
