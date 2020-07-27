// @flow

import * as React from 'react';
import { View } from 'native-base';
import { Image } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Lightbox from 'react-native-lightbox';

import {styles} from './Picture.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class Picture extends React.Component<Props, State> {

  render() {
    const { url } = this.props;

    return (
      <View style={styles.container}>
        <Lightbox>
          <Image
            style={{ height: 300 }}
            resizeMode="contain"
            source={{ uri: url }}
          />
        </Lightbox>
      </View>
    );
  }
}
