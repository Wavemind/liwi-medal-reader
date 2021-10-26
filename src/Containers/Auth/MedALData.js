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

/**
 * The internal imports
 */
import { ToggleSwitchDarkMode, SquareButton } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import NewSessionAuth from '@/Store/Auth/NewSession'
import api from '@/Services/Auth/axiosOAuth'

const DataLoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin, global },
  } = useTheme()

  // Local state definition
  const [serverAddress, setServerAddress] = useState('http://195.15.219.241')
  const [clientId, setClientId] = useState('7')

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current
  const dispatch = useDispatch()

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  /**
   * For testing. MUST BE REMOVE
   */
  const getAPI = async () => {
    const response = await api.post('/api/v1/upload-medical-case')
    console.log(response)
  }

  /**
   * PKCE process to obtain accessToken, accessTokenExpirationDate and refreshToken
   */
  const PKCE = async () => {
    dispatch(NewSessionAuth.action({ serverAddress, clientId }))
    // TODO: FETCH ALGO WHEN DATA SEND BACK ID NEEDED
    // TODO: REDIRECT USER WHEN ALGO AND HF FETCHED
  }

  return (
    <KeyboardAvoidingView behavior="height" style={global.wrapper}>
      <Animated.View style={global.animation(fadeAnim)}>
        <Text style={auth.header}>{t('containers.auth.data_login.title')}</Text>

        <View style={authLogin.formWrapper}>
          <TextInput
            style={authLogin.input}
            onChangeText={setServerAddress}
            value={serverAddress}
            placeholder={t('containers.auth.data_login.server_address')}
            autoCapitalize="none"
          />
          <TextInput
            style={authLogin.input}
            onChangeText={setClientId}
            value={clientId}
            keyboardType="decimal-pad"
            placeholder={t('containers.auth.data_login.client_id')}
          />
        </View>

        <View style={authLogin.buttonWrapper}>
          <SquareButton label={t('actions.login')} filled onPress={PKCE} />
        </View>

        <View style={authLogin.buttonWrapper}>
          <SquareButton label="Simple API Call" filled onPress={getAPI} />
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

export default DataLoginAuthContainer
