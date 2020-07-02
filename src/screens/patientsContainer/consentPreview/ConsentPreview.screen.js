// @flow
import * as React from 'react';
import { Image, Dimensions } from 'react-native';
import { View } from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';

import { styles } from './ConsentPreview.style';
import { liwiColors } from '../../../utils/constants';

export default class ConsentPreview extends React.Component {
  state = {};

  render() {
    const { medicalCase } = this.props;
    const { width, height } = Dimensions.get('window');
    return (
      <View style={{ backgroundColor: liwiColors.blackColor, margin: 0, padding: 0 }}>
        <ImageZoom minScale={1} cropWidth={width} cropHeight={height} imageWidth={width - 20} imageHeight={height} enableCenterFocus={false}>
          <Image source={{ uri: `data:image/png;base64,${medicalCase.patient.consent}` }} style={styles.documentImage} />
        </ImageZoom>
      </View>
    );
  }
}
