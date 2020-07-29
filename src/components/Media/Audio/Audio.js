import React from 'react';

import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';
import Sound from 'react-native-sound';
import Slider from 'react-native-slider';

import i18n from '../../../utils/i18n';
import { displayNotification } from '../../../utils/CustomToast';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Audio.style';

// DO NOT DESTRUCTURATE
export default class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playState: 'paused',
      playSeconds: 0,
      duration: 0,
    };

    this.sliderEditing = false;
  }

  componentDidMount() {
    this.timeout = setInterval(() => {
      if (this.sound && this.sound.isLoaded() && this.state.playState === 'playing' && !this.sliderEditing) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSeconds: seconds });
        });
      }
    }, 50);
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }

    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  /**
   * Change state of slider when it start
   */
  onSliderEditStart = () => {
    this.sliderEditing = true;
  };

  /**
   * Change state of slider when it ends
   */
  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };

  /**
   * Change time of sound when user slide the progress bar
   */
  onSliderEditing = (value) => {
    if (this.sound) {
      this.sound.setCurrentTime(value);

      this.setState({ playSeconds: value });
    }
  };

  /**
   * Start playing sound or create a new one if it's the first time
   * @param {String} url - file url
   * @returns {Promise<void>}
   */
  play = async (url) => {
    if (this.sound) {
      this.sound.play(this.playComplete);

      this.setState({ playState: 'playing' });
    } else {
      this.sound = new Sound(url, '', (error) => {
        if (error) {
          displayNotification(i18n.t('media:audio_error'), liwiColors.redColor);
          this.setState({ playState: 'paused' });
        } else {
          this.setState({ playState: 'playing', duration: this.sound.getDuration() });
          this.sound.play(this.playComplete);
        }
      });
    }
  };

  /**
   * Stop sound and set current time to 0
   * @param {Boolean} success - Sound status if it's readable
   */
  playComplete = (success) => {
    if (this.sound) {
      if (!success) {
        displayNotification(i18n.t('media:audio_error'), liwiColors.redColor);
      }
      this.setState({ playState: 'paused', playSeconds: 0 });
      this.sound.setCurrentTime(0);
    }
  };

  /**
   * Stop the sound
   */
  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }
    this.setState({ playState: 'paused' });
  };

  /**
   * Display time of sound
   * @param {Integer} seconds - Total or current time of the sound
   * @returns {string}
   */
  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }

  render() {
    const { url } = this.props;
    const durationString = this.getAudioTimeString(this.state.duration);
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds);

    return (
      <View style={styles.audioInnerContainer}>
        {this.state.playState === 'paused' && (
          <TouchableOpacity onPress={() => this.play(url)}>
            <Icon name="play" type="Feather" />
          </TouchableOpacity>
        )}
        {this.state.playState === 'playing' && (
          <TouchableOpacity onPress={() => this.pause()}>
            <Icon name="pause" type="Feather" />
          </TouchableOpacity>
        )}
        <View style={styles.audioContainer}>
          <Text style={styles.time}>{currentTimeString}</Text>
          <Slider
            onSlidingStart={this.onSliderEditStart}
            onSlidingComplete={this.onSliderEditEnd}
            onValueChange={this.onSliderEditing}
            value={this.state.playSeconds}
            maximumValue={this.state.duration}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            minimumTrackTintColor={liwiColors.redColor}
          />
          <Text style={styles.time}>{durationString}</Text>
        </View>
      </View>
    );
  }
}
