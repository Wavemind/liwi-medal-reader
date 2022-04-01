/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import SoundPlayer from 'react-native-sound-player'
import { View, TouchableOpacity, Text } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import Slider from '@react-native-community/slider'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Audio = ({ url }) => {
  // Theme and style elements deconstruction
  const {
    Components: { audio },
    FontSize,
    Colors,
    Fonts,
  } = useTheme()

  const { t } = useTranslation()

  // Local state definition
  const [loading, setLoading] = useState(true)
  const [totalDuration, setTotalDuration] = useState(0)
  const [playSeconds, setPlaySeconds] = useState(0)
  const [playState, setPlayState] = useState('paused')

  useEffect(() => {
    async function fetchSound() {
      await SoundPlayer.loadUrl(url)
      const soundInfo = await SoundPlayer.getInfo()
      setTotalDuration(soundInfo.duration)
      setLoading(false)
    }
    fetchSound()

    return () => {
      SoundPlayer.stop()
    }
  }, [])

  useEffect(() => {
    const durationInterval = setInterval(async () => {
      if (playState === 'playing') {
        const soundInfo = await SoundPlayer.getInfo()
        setPlaySeconds(soundInfo.currentTime)
      }
    }, 500)

    return () => clearInterval(durationInterval)
  }, [playState, playSeconds])

  /**
   * Display time of sound
   * @param {Integer} seconds - Total or current time of the sound
   * @returns {string}
   */
  const getAudioTimeString = seconds => {
    const h = parseInt(seconds / (60 * 60), 10)
    const m = parseInt((seconds % (60 * 60)) / 60, 10)
    const s = parseInt(seconds % 60, 10)
    const hour = `0${h}`
    const min = `0${m}`
    const sec = `0${s}`

    return `${h < 10 ? hour : h}:${m < 10 ? min : m}:${s < 10 ? sec : s}`
  }

  /**
   * Start playing sound or create a new one if it's the first time
   * @returns {Promise<void>}
   */
  const play = () => {
    setPlayState('playing')
    SoundPlayer.play()
  }

  /**
   * Pause sound
   * @returns {Promise<void>}
   */
  const pause = () => {
    setPlayState('paused')
    SoundPlayer.pause()
  }

  /**
   * Change state of slider when it start
   */
  const onSliderEditing = value => {
    setPlaySeconds(value)
    SoundPlayer.seek(value)
  }

  if (loading) {
    return <Text style={Fonts.regular}>{t('actions.loading')}</Text>
  }

  return (
    <View style={audio.audioInnerContainer}>
      {playState === 'paused' ? (
        <TouchableOpacity onPress={() => play()}>
          <Feather name="play" size={FontSize.large} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => pause()}>
          <Feather name="pause" size={FontSize.large} />
        </TouchableOpacity>
      )}

      <View style={audio.audioContainer}>
        <Text style={audio.time}>{getAudioTimeString(playSeconds)}</Text>
        <Slider
          onValueChange={value => onSliderEditing(value)}
          value={playSeconds}
          maximumValue={totalDuration}
          trackStyle={audio.track}
          thumbStyle={audio.thumb}
          minimumTrackTintColor={Colors.red}
        />
        <Text style={audio.time}>{getAudioTimeString(totalDuration)}</Text>
      </View>
    </View>
  )
}

export default Audio
