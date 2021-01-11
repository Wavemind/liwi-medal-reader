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
      device: {
        initialized: false,
        hasCamera: false,
        permissionToUseCamera: false,
        flashIsAvailable: false,
        previewHeightPercent: 1,
        previewWidthPercent: 1,
      },
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

  // On some android devices, the aspect ratio of the preview is different than
  // the screen size. This leads to distorted camera previews. This allows for correcting that.
  getPreviewSize() {
    const dimensions = Dimensions.get('window');
    // We use set margin amounts because for some reasons the percentage values don't align the camera preview in the center correctly.
    const heightMargin = ((1 - this.state.device.previewHeightPercent) * dimensions.height) / 2;
    const widthMargin = ((1 - this.state.device.previewWidthPercent) * dimensions.width) / 2;
    if (dimensions.height > dimensions.width) {
      // Portrait
      return {
        height: this.state.device.previewHeightPercent,
        width: this.state.device.previewWidthPercent,
        marginTop: heightMargin,
        marginLeft: widthMargin,
      };
    }

    // Landscape
    return {
      width: this.state.device.previewHeightPercent,
      height: this.state.device.previewWidthPercent,
      marginTop: widthMargin,
      marginLeft: heightMargin,
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

  // Called after the device gets setup. This lets you know some platform specifics
  // like if the device has a camera or flash, or even if you have permission to use the
  // camera. It also includes the aspect ratio correction of the preview
  onDeviceSetup = (deviceDetails) => {
    const { hasCamera, permissionToUseCamera, flashIsAvailable, previewHeightPercent, previewWidthPercent } = deviceDetails;
    this.setState({
      device: {
        initialized: true,
        hasCamera,
        permissionToUseCamera,
        flashIsAvailable,
        previewHeightPercent: previewHeightPercent || 1,
        previewWidthPercent: previewWidthPercent || 1,
      },
    });
  };

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
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.goBack()}>
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
              style={{ width: '100%', height: undefined, aspectRatio: 3 / 4 }}
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
