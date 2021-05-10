/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */

import { SquareSelect, ToggleSwitch } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import { Config } from '@/Config'
import ChangeEnvironment from '@/Store/System/ChangeEnvironment'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { global, settings },
    Gutters,
    Fonts,
  } = useTheme()

  // Local state definition
  const [algorithmLanguage, setAlgorithmLanguage] = useState('en')
  const [appLanguage, setAppLanguage] = useState('en')

  // Get values from the store
  const environment = useSelector(state => state.system.environment)
  const device = useSelector(state => state.device.item)
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithm = useSelector(state => state.algorithm.item)
  const darkMode = useSelector(state => state.theme.darkMode)

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  const dispatch = useDispatch()

  /**
   * Dispatches new environment to store
   * @param newEnvironment
   */
  const updateEnvironment = newEnvironment => {
    dispatch(ChangeEnvironment.action({ newEnvironment }))
  }

  /**
   * TODO
   * @param newAppLanguage
   */
  const updateAppLanguage = newAppLanguage => {
    // TODO Pour l'instant je met un state local mais a voir ou tu veux stocker l'info definitivement
    setAppLanguage(newAppLanguage)
  }

  /**
   * TODO
   * @param newAlgorithmLanguage
   */
  const updateAlgorithmLanguage = newAlgorithmLanguage => {
    // TODO Pour l'instant je met un state local mais a voir ou tu veux stocker l'info definitivement
    setAlgorithmLanguage(newAlgorithmLanguage)
  }

  /**
   * Dispatches the theme change action to the store and toggles the local enabled state
   * @param theme
   * @param darkMode
   */
  const changeTheme = () => {
    dispatch(ChangeTheme.action({ darkMode: !darkMode }))
  }

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <Animated.ScrollView style={[global.animation(fadeAnim)]}>
      <Text
        style={[
          Gutters.regularLMargin,
          Gutters.regularVMargin,
          Fonts.textSectionHeader,
        ]}
      >
        {t('containers.settings.general.title')}
      </Text>
      <View style={settings.itemGeneralStyle}>
        <SquareSelect
          label={t('containers.settings.general.environment')}
          items={Config.ENVIRONNEMENTS}
          handleOnSelect={updateEnvironment}
          value={environment}
        />
      </View>
      <View style={settings.itemGeneralStyle}>
        <SquareSelect
          label={t('containers.settings.general.app_languages')}
          items={Config.LANGUAGES}
          handleOnSelect={updateAppLanguage}
          value={appLanguage}
        />
      </View>
      <View style={settings.itemGeneralStyle}>
        <SquareSelect
          label={t('containers.settings.general.algorithm_languages')}
          items={Config.LANGUAGES}
          handleOnSelect={updateAlgorithmLanguage}
          value={algorithmLanguage}
        />
      </View>
      <View style={settings.itemGeneralStyle}>
        <ToggleSwitch
          label={t('application.theme.dark_mode')}
          handleToggle={changeTheme}
          value={darkMode}
        />
      </View>

      <Text
        style={[
          Gutters.regularLMargin,
          Gutters.regularVMargin,
          Fonts.textSectionHeader,
        ]}
      >
        {t('containers.settings.algorithm.title')}
      </Text>
      {Object.keys(algorithm).map(info => {
        if (Config.ALGORITHM_INFO.includes(info)) {
          return (
            <View style={settings.itemStyle}>
              <Text style={settings.textStyle}>{t(`algorithm.${info}`)}</Text>
              <Text style={[settings.textStyle, Fonts.textBold]}>
                {algorithm[info]}
              </Text>
            </View>
          )
        }
      })}

      <Text
        style={[
          Gutters.regularLMargin,
          Gutters.regularVMargin,
          Fonts.textSectionHeader,
        ]}
      >
        {t('containers.settings.health_facility.title')}
      </Text>
      {Object.keys(healthFacility).map(info => {
        if (Config.HEALTH_FACILITY_INFO.includes(info)) {
          return (
            <View style={settings.itemStyle}>
              <Text style={settings.textStyle}>
                {t(`health_facility.${info}`)}
              </Text>
              <Text style={[settings.textStyle, Fonts.textBold]}>
                {healthFacility[info]}
              </Text>
            </View>
          )
        }
      })}

      <Text
        style={[
          Gutters.regularLMargin,
          Gutters.regularVMargin,
          Fonts.textSectionHeader,
        ]}
      >
        {t('containers.settings.device.title')}
      </Text>
      {Object.keys(device).map(info => {
        if (Config.DEVICE_INFO.includes(info)) {
          return (
            <View style={settings.itemStyle}>
              <Text style={settings.textStyle}>{t(`device.${info}`)}</Text>
              <Text style={[settings.textStyle, Fonts.textBold]}>
                {device[info]}
              </Text>
            </View>
          )
        }
      })}
    </Animated.ScrollView>
  )
}

export default LoginAuthContainer
