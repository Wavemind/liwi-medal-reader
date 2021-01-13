// @flow
import React from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import { RNCamera } from 'react-native-camera';
import * as RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

import { styles } from './ConsentCapture.style';
import LiwiLoader from '../../../utils/LiwiLoader';

export default class ConsentCapture extends React.Component {
  state = {
    loading: false,
    autoFocusPoint: {
      normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'back',
    ratio: '16:9',
  };

  /**
   * Will focus in the touched area
   * @param event
   */
  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const { width, height } = Dimensions.get('window');
    const screenWidth = width;
    const screenHeight = height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;

    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    });
  }

  /**
   * Takes a picture and stores the image in the patient when the picture is processed and resized
   * @returns {Promise<void>}
   */
  takePicture = async function () {
    const { addConsentFile, navigation } = this.props;
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      this.setState({ loading: true });
      ImageResizer.createResizedImage(data.uri, 720, 960, 'JPEG', 93)
        .then((response) => {
          RNFS.readFile(response.uri.substring(7), 'base64').then((newFile) => {
            addConsentFile(newFile);
            navigation.goBack();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  renderCamera() {
    const {
      type,
      ratio,
      depth,
      autoFocusPoint: { normalized, drawRectPosition },
    } = this.state;

    const {
      app: { t },
    } = this.props;

    const drawFocusRingPosition = {
      top: drawRectPosition.y - 32,
      left: drawRectPosition.x - 32,
    };

    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={styles.camera}
        type={type}
        flashMode="off"
        autoFocus="on"
        autoFocusPointOfInterest={normalized}
        ratio={ratio}
        focusDepth={depth}
        androidCameraPermissionOptions={{
          title: t('patient_upsert:permission_title'),
          message: t('patient_upsert:permission_message'),
          buttonPositive: t('patient_upsert:permission_buttonPositive'),
          buttonNegative: t('patient_upsert:permission_buttonNegative'),
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={(e) => this.touchToFocus(e)}>
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity style={[styles.flipButton]} onPress={(e) => this.takePicture(e)}>
            <Icon name="dot-circle" style={styles.snapIcon} type="FontAwesome5" />
          </TouchableOpacity>
        </View>
      </RNCamera>
    );
  }

  render() {
    const { loading } = this.state;
    return loading ? <LiwiLoader /> : <View style={styles.container}>{this.renderCamera()}</View>;
  }
}
