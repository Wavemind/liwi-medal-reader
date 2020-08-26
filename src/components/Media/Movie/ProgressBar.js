import React from 'react';
import Slider from 'react-native-slider';
import { View, Text } from 'react-native';

import { styles } from './Movie.styles';
import { liwiColors } from '../../../utils/constants';

export const ProgressBar = ({ currentTime, duration, onSlideCapture, onSlideStart, onSlideComplete }) => {
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);

  return (
    <View style={styles.wrapper}>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={liwiColors.redColor}
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor={liwiColors.redColor}
      />
      <View style={styles.timeWrapper}>
        <Text style={styles.timeLeft}>{position}</Text>
        <Text style={styles.timeRight}>{fullDuration}</Text>
      </View>
    </View>
  );

  /**
   * Display duration and current time
   * @param time
   * @returns {string}
   */
  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}`;
  }

  /**
   * Event when user slides the progress bar
   * @param time
   */
  function handleOnSlide(time) {
    onSlideCapture({ seekTime: time });
  }
};
