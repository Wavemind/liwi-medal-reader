/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { ToggleSwitchDarkMode, SquareButton } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import NewSessionAuth from '@/Store/Auth/NewSession'
import DestroyAlgorithm from '@/Store/Algorithm/Destroy'
import DestroyHealthFacility from '@/Store/HealthFacility/Destroy'
import DestroyAuth from '@/Store/Auth/Destroy'

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Fonts,
    Containers: { auth, authLogin, global },
  } = useTheme()

  // Local state definition
  const [serverAddress, setServerAddress] = useState(
    __DEV__ ? 'http://195.15.219.241:8080' : '',
  )
  const [clientId, setClientId] = useState(__DEV__ ? '1' : '')

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current
  const dispatch = useDispatch()

  useEffect(() => {
    // Remove element in persist storage if user is disconnected
    dispatch(DestroyAlgorithm.action())
    dispatch(DestroyHealthFacility.action())
    dispatch(DestroyAuth.action())
  }, [])

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  /**
   * PKCE process to obtain accessToken, accessTokenExpirationDate and refreshToken
   */
  const processAuth = async () => {
    const newSessionResponse = await dispatch(
      NewSessionAuth.action({ serverAddress, clientId }),
    )
    if (isFulfilled(newSessionResponse)) {
      navigate('Synchronize')
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" style={global.wrapper}>
      <Animated.View style={global.animation(fadeAnim)}>
        <Text style={auth.header}>{t('containers.auth.login.title')}</Text>

        <View style={authLogin.formWrapper}>
          <Text style={Fonts.textRegular}>
            {t('containers.auth.login.server_address')}
          </Text>
          <TextInput
            style={authLogin.input}
            onChangeText={setServerAddress}
            value={serverAddress}
            placeholder="https://.."
            autoCapitalize="none"
          />
          <Text style={Fonts.textRegular}>
            {t('containers.auth.login.client_id')}
          </Text>
          <TextInput
            style={authLogin.input}
            onChangeText={setClientId}
            value={clientId}
            keyboardType="decimal-pad"
          />
          <View style={authLogin.buttonWrapper}>
            <SquareButton
              label={t('actions.login')}
              filled
              onPress={processAuth}
            />
          </View>
        </View>

        <SafeAreaView>
          <View style={auth.themeToggleWrapper}>
            <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
          </View>
        </SafeAreaView>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default LoginAuthContainer
