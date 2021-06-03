/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { RNCamera } from 'react-native-camera'
import * as RNFS from 'react-native-fs'
import * as _ from 'lodash'
import ImageResizer from 'react-native-image-resizer'
import Feather from 'react-native-vector-icons/Feather'

/**
 * The internal imports
 */
import { Loader } from '@/Components'
import consentCamera from '@/Theme/containers/Consent/Camera.style'

export default class CameraConsentContainer extends React.Component {
  state = {
    loading: false,
  }

  /**
   * Takes a picture and stores the image in the patient when the picture is processed and resized
   * @returns {Promise<void>}
   */
  takePicture = async function () {
    if (this.camera) {
      this.setState({ loading: true })
      const data = await this.camera.takePictureAsync()
      ImageResizer.createResizedImage(data.uri, 720, 960, 'JPEG', 93)
        .then(response => {
          RNFS.readFile(response.uri.substring(7), 'base64').then(newFile => {
            console.log('TODO DO STUFF HERE WITH', newFile)
            this.setState({ loading: false })
            this.props.navigation.navigate('Preview', { consent: newFile })
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  render() {
    const { loading } = this.state

    return (
      <RNCamera
        ref={ref => {
          this.camera = ref
        }}
        style={{
          flex: 1,
          paddingTop: 10,
          backgroundColor: '#000',
        }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        ratio="16:9"
        captureAudio={false}
        focusDepth={0}
      >
        <View
          style={{
            height: 75,
            flexDirection: 'row',
            bottom: 15,
            position: 'absolute',
            alignSelf: 'center',
          }}
        >
          {loading ? (
            <View style={{ width: 200 }}>
              <Loader />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={e => this.takePicture(e)}
            >
              <Feather
                name="camera"
                style={{ color: 'white', fontSize: 75, opacity: 0.7 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </RNCamera>
    )
  }
}
