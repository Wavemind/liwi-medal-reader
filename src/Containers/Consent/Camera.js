/**
 * The external imports
 */
import React, { useRef, useState, useMemo, useCallback } from 'react'
import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as RNFS from 'react-native-fs'
import Feather from 'react-native-vector-icons/Feather'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useCameraDevices, Camera } from 'react-native-vision-camera'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { Loader } from '@/Components'
import { useTheme } from '@/Theme'

const CameraConsentContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Containers: { camera },
  } = useTheme()

  const cameraRef = useRef(null)
  const isFocused = useIsFocused()

  const [_isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cameraPosition, setCameraPosition] = useState('back')
  const [flash, setFlash] = useState('off')

  // Camera format settings
  const devices = useCameraDevices()
  const device = devices[cameraPosition]

  /**
   * Supports camera flip ?
   */
  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  )

  /**
   * Camera configuration
   */
  const takePhotoOptions = useMemo(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
    }),
    [flash],
  )

  const onError = useCallback(error => {
    console.error(error)
  }, [])

  /**
   * Flip camera
   */
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'))
  }, [])

  /**
   * Set flash
   */
  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'))
  }, [])

  /**
   * Initialize camera on screen focus
   */
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true)
  }, [isFocused])

  /**
   * Take picture
   */
  const takePhoto = useCallback(async () => {
    setLoading(true)
    try {
      if (cameraRef.current == null) {
        throw new Error('Camera ref is null')
      }

      const photo = await cameraRef.current.takePhoto(takePhotoOptions)
      onMediaCaptured(photo, 'photo')
    } catch (e) {
      setLoading(false)
      console.error('Failed to take photo', e)
    }
  }, [cameraRef, onMediaCaptured, takePhotoOptions])

  /**
   * Process picture, convert to base64 and navigate to preview
   */
  const onMediaCaptured = useCallback(
    media =>
      RNFS.readFile(media.path, 'base64').then(newFile => {
        setLoading(false)
        navigation.navigate('Preview', {
          consent: newFile,
          retake: true,
        })
      }),
    [navigation],
  )

  if (device == null) {
    return <Loader />
  }

  return (
    <View style={camera.container}>
      <Camera
        ref={cameraRef}
        device={device}
        onError={onError}
        enableZoomGesture={true}
        style={camera.camera}
        photo={true}
        audio={false}
        isActive={isFocused}
        onInitialized={onInitialized}
      />

      <TouchableOpacity
        onPress={takePhoto}
        disabled={loading}
        style={camera.takePhotoButton}
      >
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Feather name="circle" style={camera.takePhotoIcon} />
        )}
      </TouchableOpacity>

      <View style={camera.buttonWrapper}>
        {supportsCameraFlipping && (
          <TouchableOpacity
            onPress={onFlipCameraPressed}
            style={camera.actionButtons}
          >
            <IonIcon name="camera-reverse" style={camera.sideIcon} />
          </TouchableOpacity>
        )}
        {device.hasFlash && (
          <TouchableOpacity
            onPress={onFlashPressed}
            style={camera.actionButtons}
          >
            <IonIcon
              name={flash === 'on' ? 'flash' : 'flash-off'}
              style={camera.sideIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CameraConsentContainer
