import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { styles } from './Movie.styles';

export const PlayerControls = ({ playing, showPreviousAndNext, showSkip, previousDisabled, nextDisabled, onPlay, onPause, skipForwards, skipBackwards, onNext, onPrevious }) => (
  <View style={styles.wrapperControls}>
    {showPreviousAndNext && (
      <TouchableOpacity
style={[styles.touchable, previousDisabled && styles.touchableDisabled]} onPress={onPrevious} disabled={previousDisabled}>
        <Icon name="skip-back" type="Feather" style={styles.icon} />
      </TouchableOpacity>
    )}

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
        <Icon name="rotate-ccw" type="Feather" style={styles.icon} />
      </TouchableOpacity>
    )}

    <TouchableOpacity
style={styles.touchable} onPress={playing ? onPause : onPlay}>
      {playing ? <Icon name="pause" type="Feather" style={styles.icon} /> : <Icon name="play" type="Feather" style={styles.icon} />}
    </TouchableOpacity>

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
        <Icon name="rotate-cw" type="Feather" style={styles.icon} />
      </TouchableOpacity>
    )}

    {showPreviousAndNext && (
      <TouchableOpacity
style={[styles.touchable, nextDisabled && styles.touchableDisabled]} onPress={onNext} disabled={nextDisabled}>
        <Icon name="skip-forward" type="Feather" style={styles.icon} />
      </TouchableOpacity>
    )}
  </View>
);
