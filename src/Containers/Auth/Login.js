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

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin, global },
  } = useTheme()

  // Local state definition
  const [serverAddress, setServerAddress] = useState('http://195.15.219.241')
  const [clientId, setClientId] = useState('3')

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current
  const dispatch = useDispatch()

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
          <TextInput
            style={authLogin.input}
            onChangeText={setServerAddress}
            value={serverAddress}
            placeholder={t('containers.auth.login.server_address')}
            autoCapitalize="none"
          />
          <TextInput
            style={authLogin.input}
            onChangeText={setClientId}
            value={clientId}
            keyboardType="decimal-pad"
            placeholder={t('containers.auth.login.client_id')}
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
