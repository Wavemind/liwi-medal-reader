// @flow
import * as React from 'react';
import { View, Icon } from 'native-base';
import Scanner, { RectangleOverlay } from 'react-native-rectangle-scanner';
import { Dimensions, TouchableOpacity } from 'react-native';

import RNFS from 'react-native-fs';
import LiwiLoader from '../../../utils/LiwiLoader';
import { styles } from './ConsentCapture.style';

export default class ConsentCapture extends React.Component {
  state = {
    loading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      previewHeightPercent: 1,
      previewWidthPercent: 1,
    };

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
   * On some android devices, the aspect ratio of the preview is different than
   * the screen size. This leads to distorted camera previews. This allows for correcting that.
   * @returns {{width, marginTop: number, height, marginLeft: number}}
   */
  getPreviewSize() {
    const { previewHeightPercent, previewWidthPercent } = this.state;
    const dimensions = Dimensions.get('window');

    // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
    const heightMargin = ((1 - previewHeightPercent) * dimensions.height) / 2;
    const widthMargin = ((1 - previewWidthPercent) * dimensions.width) / 2;
    return {
      height: previewHeightPercent,
      width: previewWidthPercent,
      marginTop: heightMargin,
      marginLeft: widthMargin,
    };
  }

  /**
   * When the scanner detects a rectangle he triggers the capture of the picture
   * @param data
   */
  handleRectangleDetected = async (data) => {
    if (data.detectedRectangle !== false) {
      this.setState({ detectedRectangle: data.detectedRectangle });
    }
  };

  /**
   * Called after the device gets setup. This lets you know some platform specific
   * like if the device has a camera or flash, or even if you have permission to use the
   * camera. It also includes the aspect ratio correction of the preview
   * @param deviceDetails
   */
  onDeviceSetup = (deviceDetails) => {
    const { previewHeightPercent, previewWidthPercent } = deviceDetails;
    this.setState({
      previewHeightPercent: previewHeightPercent || 1,
      previewWidthPercent: previewWidthPercent || 1,
    });
  };

  /**
   * Render snap and cancel button
   * @returns {JSX.Element}
   */
  renderCameraControls() {
    const { navigation } = this.props;

    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <View style={styles.cameraOutline}>
            <TouchableOpacity activeOpacity={0.8} style={styles.cameraButton} onPress={() => this.camera.current.capture()} />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={navigation.goBack}>
            <Icon name="close" type="AntDesign" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { loading, detectedRectangle } = this.state;
    const previewSize = this.getPreviewSize();
    return (
      <>
        <View style={styles.content}>
          {loading ? (
            <LiwiLoader />
          ) : (
            <Scanner
              onRectangleDetected={this.handleRectangleDetected}
              onPictureProcessed={this.handleOnPictureProcessed}
              ref={this.camera}
              style={styles.scannerWrapper}
              onDeviceSetup={this.onDeviceSetup}
            />
          )}
          <RectangleOverlay detectedRectangle={detectedRectangle} previewRatio={previewSize} backgroundColor="rgba(255,181,6, 0.2)" borderColor="rgb(255,181,6)" borderWidth={4} />
          {this.renderCameraControls()}
        </View>
      </>
    );
  }
}
