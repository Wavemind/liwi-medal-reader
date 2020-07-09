// @flow
import * as React from 'react';
import { Image, Dimensions } from 'react-native';
import { View } from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';

import { styles } from './ConsentPreview.style';

export default class ConsentPreview extends React.Component {
  state = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  render() {
    const { state } = this.props;

    // State can either be a patient or a medical case
    const consent = state.consent_file !== undefined ? state.consent_file : state.patient.consent_file;
    const { width, height } = this.state;

    return (
      <View style={styles.content}>
        <ImageZoom minScale={1} cropWidth={width} cropHeight={height} imageWidth={width - 20} imageHeight={height} enableCenterFocus={false}>
          <Image source={{ uri: `data:image/png;base64,${consent}` }} style={styles.documentImage} />
        </ImageZoom>
      </View>
    );
  }
}
