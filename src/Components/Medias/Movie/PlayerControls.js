/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

export const PlayerControls = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
}) => {
  const {
    Components: { movieController },
  } = useTheme()

  return (
    <View style={movieController.wrapperControls}>
      {showPreviousAndNext && (
        <TouchableOpacity
          style={[
            movieController.touchable,
            previousDisabled && movieController.touchableDisabled,
          ]}
          onPress={onPrevious}
          disabled={previousDisabled}
        >
          <Feather name="skip-back" style={movieController.icon} />
        </TouchableOpacity>
      )}

      {showSkip && (
        <TouchableOpacity
          style={movieController.touchable}
          onPress={skipBackwards}
        >
          <Feather name="rotate-ccw" style={movieController.icon} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={movieController.touchable}
        onPress={playing ? onPause : onPlay}
      >
        {playing ? (
          <Feather name="pause" style={movieController.icon} />
        ) : (
          <Feather name="play" style={movieController.icon} />
        )}
      </TouchableOpacity>

      {showSkip && (
        <TouchableOpacity
          style={movieController.touchable}
          onPress={skipForwards}
        >
          <Feather name="rotate-cw" style={movieController.icon} />
        </TouchableOpacity>
      )}

      {showPreviousAndNext && (
        <TouchableOpacity
          style={[
            movieController.touchable,
            nextDisabled && movieController.touchableDisabled,
          ]}
          onPress={onNext}
          disabled={nextDisabled}
        >
          <Feather name="skip-forward" style={movieController.icon} />
        </TouchableOpacity>
      )}
    </View>
  )
}
