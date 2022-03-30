/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native'
import Video from 'react-native-video'
import Orientation from 'react-native-orientation-locker'
import Feather from 'react-native-vector-icons/Feather'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { PlayerControls, ProgressBar } from '@/Components'

export default function Movie(movie) {
  const {
    Components: { movieController },
  } = useTheme()

  const videoRef = React.createRef()
  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
    allowFullscreen: false,
  })

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation)

    return () => {
      Orientation.removeOrientationListener(handleOrientation)
    }
  }, [])

  /**
   * Renders the correct icon
   * @returns jsx
   */
  const renderFullscreen = () => {
    if (state.fullscreen) {
      return <Feather name="minimize" style={movieController.icon} />
    }
    return <Feather name="maximize" style={movieController.icon} />
  }

  return (
    <View style={movieController.container}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View>
          <Video
            ref={videoRef}
            source={{
              uri: movie.url,
            }}
            style={
              state.fullscreen
                ? movieController.fullscreenVideo
                : movieController.video
            }
            controls={false}
            resizeMode="contain"
            onLoad={onLoadEnd}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
          />
          {state.showControls && (
            <View style={movieController.controlOverlay}>
              {state.allowFullscreen ? (
                <TouchableOpacity
                  onPress={handleFullscreen}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={movieController.fullscreenButton}
                >
                  {renderFullscreen()}
                </TouchableOpacity>
              ) : null}

              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )

  /**
   * Change orientation lock
   * @param {String} orientation - actual orientation
   */
  function handleOrientation(orientation) {
    return orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({ ...s, fullscreen: true })), StatusBar.setHidden(true))
      : (setState(s => ({ ...s, fullscreen: false })),
        StatusBar.setHidden(false))
  }

  /**
   * Update device orientation when user clicked on fullscreen icon
   */
  function handleFullscreen() {
    return state.fullscreen
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToLandscapeLeft()
  }

  /**
   * Play or pause movie
   */
  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({ ...state, play: false, showControls: true })
      return
    }

    setState({ ...state, play: true })
    setTimeout(() => setState(s => ({ ...s, showControls: false })), 2000)
  }

  /**
   * Go 15 seconds back
   */
  function skipBackward() {
    videoRef.current.seek(state.currentTime - 15)
    setState({ ...state, currentTime: state.currentTime - 15 })
  }

  /**
   * Go 15 seconds forward
   */
  function skipForward() {
    videoRef.current.seek(state.currentTime + 15)
    setState({ ...state, currentTime: state.currentTime + 15 })
  }

  /**
   * Change movie time when user slide the progress bar
   * @param data
   */
  function onSeek(data) {
    videoRef.current.seek(data.seekTime)
    setState({ ...state, currentTime: data.seekTime })
  }

  /**
   * Set movie data when all data is loaded
   * @param data
   */
  function onLoadEnd(data) {
    setState(s => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }))
  }

  /**
   * Update progress bar
   * @param data
   */
  function onProgress(data) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }))
  }

  /**
   * Set time to end when movie is finish
   */
  function onEnd() {
    setState({ ...state, play: false })
    videoRef.current.seek(0)
  }

  /**
   * Display or not controls when user hit the screen
   */
  function showControls() {
    state.showControls
      ? setState({ ...state, showControls: false })
      : setState({ ...state, showControls: true })
  }
}
