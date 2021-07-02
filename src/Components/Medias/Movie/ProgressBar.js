/**
 * The external imports
 */
import React from 'react'
import Slider from '@react-native-community/slider'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const ProgressBar = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
}) => {
  const position = getMinutesFromSeconds(currentTime)
  const fullDuration = getMinutesFromSeconds(duration)

  const {
    Components: { movieController },
    Colors,
  } = useTheme()

  return (
    <View style={movieController.wrapper}>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={Colors.red}
        maximumTrackTintColor={Colors.secondary}
        thumbTintColor={Colors.red}
      />
      <View style={movieController.timeWrapper}>
        <Text style={movieController.timeLeft}>{position}</Text>
        <Text style={movieController.timeRight}>{fullDuration}</Text>
      </View>
    </View>
  )

  /**
   * Display duration and current time
   * @param time
   * @returns {string}
   */
  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0
    const seconds = Math.floor(time - minutes * 60)

    return `${minutes >= 10 ? minutes : `0${minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`
  }

  /**
   * Event when user slides the progress bar
   * @param time
   */
  function handleOnSlide(time) {
    onSlideCapture({ seekTime: time })
  }
}

export default ProgressBar
