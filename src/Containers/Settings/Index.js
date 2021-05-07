/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Animated, KeyboardAvoidingView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */

import { SquareSelect, ToggleSwitchDarkMode, SectionHeader } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import { Config } from '@/Config'
import ChangeEnvironment from '@/Store/System/ChangeEnvironment'

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, settingsStyles },
  } = useTheme()

  // Local state definition
  const [algorithmLanguage, setAlgorithmLanguage] = useState('en')
  const [appLanguage, setAppLanguage] = useState('en')
  // TODO Voir si tu veux mettre un loading pendant qu'on update le store ou le backend or whatever ?
  const [loading, setLoading] = useState(false)

  // Get values from the store
  const environment = useSelector(state => state.system.environment)
  const deviceInfo = useSelector(state => state.device.item)
  const healthFacilityInfo = useSelector(state => state.healthFacility.item)

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

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={50}
      style={auth.wrapper}
    >
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>{t('containers.settings.title')}</Text>
        <SectionHeader label={t('containers.settings.device.title')} />
        {Object.keys(deviceInfo).map((info) => {
          // TODO Je pense qu'on s'en fout du id et du created_at et tout le reste, du coup j'ai faut un filtre dans Config
          if (Config.DEVICE_INFO.includes(info)) {
            return (
              <View style={settingsStyles.itemStyle}>
                <Text style={settingsStyles.textStyle}>{t(`containers.settings.device.${info}`)}</Text>
                <Text style={settingsStyles.textStyle}>{deviceInfo[info]}</Text>
              </View>
            )
          }
        })}

        <SectionHeader label={t('containers.settings.health_facility.title')} />
        {Object.keys(healthFacilityInfo).map((info) => {
          // TODO Je pense qu'on s'en fout du id et du created_at et tout le reste, du coup j'ai faut un filtre dans Config
          if (Config.HEALTH_FACILITY_INFO.includes(info)) {
            return (
              <View style={settingsStyles.itemStyle}>
                <Text style={settingsStyles.textStyle}>{t(`containers.settings.health_facility.${info}`)}</Text>
                <Text style={settingsStyles.textStyle}>{healthFacilityInfo[info]}</Text>
              </View>
            )
          }
        })}
        <SectionHeader label={t('containers.settings.options.title')} />
        <SquareSelect
          label={t('containers.settings.options.environment')}
          items={Config.ENVIRONNEMENTS}
          handleOnSelect={updateEnvironment}
          value={environment}
        />
        <SquareSelect
          label={t('containers.settings.options.app_languages')}
          items={Config.LANGUAGES}
          handleOnSelect={updateAppLanguage}
          value={appLanguage}
        />
        <SquareSelect
          label={t('containers.settings.options.algorithm_languages')}
          items={Config.LANGUAGES}
          handleOnSelect={updateAlgorithmLanguage}
          value={algorithmLanguage}
        />

        <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default LoginAuthContainer
