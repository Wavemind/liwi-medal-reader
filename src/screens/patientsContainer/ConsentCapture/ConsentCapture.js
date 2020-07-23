// @flow
import * as React from 'react';
import { View } from 'native-base';
import Scanner from 'react-native-rectangle-scanner';
import RNFS from 'react-native-fs';

import LiwiLoader from '../../../utils/LiwiLoader';
import { styles } from './ConsentCapture.style';

export default class ConsentCapture extends React.Component {
  state = {
    loading: false,
  };

  constructor(props) {
    super(props);
    this.camera = React.createRef();
  }

  /**
   * Stores the cropped image in the patient when the picture is processed
   * @param croppedImage
   * @returns {Promise<void>}
   */
  handleOnPictureProcessed = async ({ croppedImage }) => {
    const { addConsentFile, navigation } = this.props;
    this.setState({ loading: true });

    addConsentFile(await RNFS.readFile(croppedImage, 'base64'));
    navigation.goBack();
  };
  /**
   * When the scanner detects a rectangle he triggers the capture of the picture
   * @param data
   */
  handleRectangleDetected = (data) => {
    if (data.detectedRectangle !== false) {
      this.camera.current.capture();
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <>
        <View style={styles.content}>
          {loading ? <LiwiLoader /> : <Scanner onRectangleDetected={this.handleRectangleDetected} onPictureProcessed={this.handleOnPictureProcessed} ref={this.camera} style={{ flex: 1 }} />}
        </View>
      </>
    );
  }
}
