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
import ChangeAppLanguage from '@/Store/System/ChangeLanguage'
import ChangeAlgoLanguage from '@/Store/Algorithm/ChangeLanguage'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t, i18n } = useTranslation()
  const {
    Containers: { global, settings },
    Fonts,
  } = useTheme()

  // Local state definition
  const [algorithmLanguage, setAlgorithmLanguage] = useState(
    useSelector(state => state.system.language),
  )
  const [appLanguage, setAppLanguage] = useState(
    useSelector(state => state.algorithm.language),
  )

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
  const updateEnvironment = async newEnvironment => {
    dispatch(ChangeEnvironment.action({ newEnvironment }))
  }

  /**
   * Update app language and update store
   * @param newAppLanguage
   */
  const changeAppLanguage = async newAppLanguage => {
    i18n.changeLanguage(newAppLanguage)
    setAppLanguage(newAppLanguage)
    await dispatch(ChangeAppLanguage.action({ newLanguage: newAppLanguage }))
  }

  /**
   * Update algorithm language in store
   * @param newAlgorithmLanguage
   */
  const changeAlgorithmLanguage = async newAlgorithmLanguage => {
    await dispatch(
      ChangeAlgoLanguage.action({ newLanguage: newAlgorithmLanguage }),
    )
    setAlgorithmLanguage(newAlgorithmLanguage)
  }

  /**
   * Update theme mode in store
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
      <Text style={[settings.title]}>
        {t('containers.settings.general.title')}
      </Text>
      <View style={settings.itemGeneral}>
        <SquareSelect
          label={t('containers.settings.general.environment')}
          items={Config.ENVIRONNEMENTS}
          handleOnSelect={updateEnvironment}
          value={environment}
        />
      </View>
      <View style={settings.itemGeneral}>
        <SquareSelect
          label={t('containers.settings.general.app_languages')}
          items={Config.LANGUAGES}
          handleOnSelect={changeAppLanguage}
          value={appLanguage}
        />
      </View>
      <View style={settings.itemGeneral}>
        <SquareSelect
          label={t('containers.settings.general.algorithm_languages')}
          items={Config.LANGUAGES}
          handleOnSelect={changeAlgorithmLanguage}
          value={algorithmLanguage}
        />
      </View>
      <View style={settings.itemGeneral}>
        <ToggleSwitch
          label={t('application.theme.dark_mode')}
          handleToggle={changeTheme}
          value={darkMode}
        />
      </View>

      <Text style={[settings.title]}>
        {t('containers.settings.algorithm.title')}
      </Text>
      {Object.keys(algorithm).map(info => {
        if (Config.ALGORITHM_INFO.includes(info)) {
          return (
            <View style={settings.item}>
              <Text style={settings.text}>{t(`algorithm.${info}`)}</Text>
              <Text style={[settings.text, Fonts.textBold]}>
                {algorithm[info]}
              </Text>
            </View>
          )
        }
      })}

      <Text style={[settings.title]}>
        {t('containers.settings.health_facility.title')}
      </Text>
      {Object.keys(healthFacility).map(info => {
        if (Config.HEALTH_FACILITY_INFO.includes(info)) {
          return (
            <View style={settings.item}>
              <Text style={settings.text}>{t(`health_facility.${info}`)}</Text>
              <Text style={[settings.text, Fonts.textBold]}>
                {healthFacility[info]}
              </Text>
            </View>
          )
        }
      })}

      <Text style={[settings.title]}>
        {t('containers.settings.device.title')}
      </Text>
      {Object.keys(device).map(info => {
        if (Config.DEVICE_INFO.includes(info)) {
          return (
            <View style={settings.item}>
              <Text style={settings.text}>{t(`device.${info}`)}</Text>
              <Text style={[settings.text, Fonts.textBold]}>
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