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
import { authorize, refresh } from 'react-native-app-auth'

/**
 * The internal imports
 */
import { ToggleSwitchDarkMode, SquareButton } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'

const DataLoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin, global },
  } = useTheme()

  const authEndpoint = '/oauth/authorize'
  const tokenEndpoint = '/oauth/token'
  const apiEndPoint = '/api/user'

  const [token, setTokenVal] = useState('')
  const [refreshToken, setRefreshTokenVal] = useState('')
  const [serverAddress, setServerAddress] = useState('http://10.0.2.2:8000')
  const [clientID, setClientID] = useState('16')
  const callBackURL = 'aaa://callback'

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  /**
   * Generate config based on user selection
   * @returns hash of OAuth config
   */
  const createConfig = () => {
    return {
      issuer: serverAddress,
      clientId: clientID,
      redirectUrl: callBackURL,
      scopes: [],
      serviceConfiguration: {
        authorizationEndpoint: serverAddress + authEndpoint,
        tokenEndpoint: serverAddress + tokenEndpoint,
      },
      dangerouslyAllowInsecureHttpRequests: true,
    }
  }

  /**
   * Simple API call for testing
   */
  const getAPI = async () => {
    var bearer = 'Bearer ' + token
    fetch(serverAddress + apiEndPoint, {
      method: 'get',
      withCredentials: true,
      credentials: 'include',
      headers: new Headers({
        Authorization: bearer,
        Accept: 'application/json',
      }),
    })
      .then(response => {
        console.log(response.status)
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('something went wrong')
        }
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  /**
   * PKCE process to obtain accessToken, accessTokenExpirationDate and refreshToken
   */
  const PKCE = async () => {
    var config = createConfig()
    try {
      const result = await authorize(config)
      console.log('PKCE', result)
      setTokenVal(result.accessToken)
      setRefreshTokenVal(result.refreshToken)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Get refresh token
   * @returns
   */
  const Refresh = async () => {
    if (refreshToken === '') {
      console.log('Refresh Token is not Set')
      return
    }
    var config = createConfig()
    try {
      const result = await refresh(config, {
        refreshToken: refreshToken,
      })
      setTokenVal(result.accessToken)
      setRefreshTokenVal(result.refreshToken)
    } catch (error) {
      console.log(error)
    }
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
            onChangeText={setClientID}
            value={clientID}
            keyboardType="decimal-pad"
            placeholder={t('containers.auth.data_login.client_id')}
          />
        </View>

        <View style={authLogin.buttonWrapper}>
          <SquareButton label="Start PKCE" filled onPress={PKCE} />
        </View>

        <View style={authLogin.buttonWrapper}>
          <SquareButton label="Simple API Call" filled onPress={getAPI} />
        </View>

        <View style={authLogin.buttonWrapper}>
          <SquareButton label="Get Refresh TOKEN" filled onPress={Refresh} />
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
