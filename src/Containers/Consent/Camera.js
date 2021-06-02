/**
 * The external imports
 */
import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as RNFS from 'react-native-fs'
import * as _ from 'lodash'
import ImageResizer from 'react-native-image-resizer'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const CameraConsentContainer = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { scan },
  } = useTheme()

  /**
   * Handles navigation after Scan successful
   */
  // useEffect(() => {
  // openMedicalCase(scanData)
  // }, [scanData])

  /**
   * Will focus in the touched area
   * @param event
   */
  const touchToFocus = event => {
    const { pageX, pageY } = event.nativeEvent
    const { width, height } = Dimensions.get('window')
    const screenWidth = width
    const screenHeight = height
    const isPortrait = screenHeight > screenWidth

    let x = pageX / screenWidth
    let y = pageY / screenHeight

    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight
      y = -(pageX / screenWidth) + 1
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    })
  }

  /**
   * Takes a picture and stores the image in the patient when the picture is processed and resized
   * @returns {Promise<void>}
   */
  const takePicture = async () => {
    const { addConsentFile, navigation } = this.props

    if (this.camera) {
      const data = await this.camera.takePictureAsync()
      ImageResizer.createResizedImage(data.uri, 720, 960, 'JPEG', 93)
        .then(response => {
          RNFS.readFile(response.uri.substring(7), 'base64').then(newFile => {
            addConsentFile(newFile)
            navigation.goBack()
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

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
      type={type}
      flashMode="off"
      autoFocus="on"
      autoFocusPointOfInterest={normalized}
      ratio={ratio}
      focusDepth={depth}
    >
      <View style={StyleSheet.absoluteFill}>
        <View
          style={[
            {
              position: 'absolute',
              height: 64,
              width: 64,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: 'white',
              opacity: 0.4,
            },
            drawFocusRingPosition,
          ]}
        />
        <TouchableWithoutFeedback onPress={e => this.touchToFocus(e)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>

      <View
        style={{
          height: 75,
          flexDirection: 'row',
          bottom: 15,
          position: 'absolute',
          alignSelf: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={e => this.takePicture(e)}
        >
          <Icon
            name="dot-circle"
            style={{ color: 'white', fontSize: 75, opacity: 0.7 }}
            type="FontAwesome5"
          />
        </TouchableOpacity>
      </View>
    </RNCamera>
  )
}

export default CameraConsentContainer
