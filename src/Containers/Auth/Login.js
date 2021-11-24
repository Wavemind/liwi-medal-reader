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
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { ToggleSwitchDarkMode, SquareButton, Loader } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import NewSessionAuth from '@/Store/Auth/NewSession'
import FetchOneHealthFacility from '@/Store/HealthFacility/FetchOne'
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import FetchOneEmergency from '@/Store/Emergency/FetchOne'

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin, global },
  } = useTheme()

  // Local state definition
  const [serverAddress, setServerAddress] = useState('http://195.15.219.241')
  const [clientId, setClientId] = useState('3')
  const [loading, setLoading] = useState(false)

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current
  const dispatch = useDispatch()

  // Get values from the store
  const healthFacilityFetchOneError = useSelector(
    state => state.healthFacility.fetchOne.error,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  /**
   * PKCE process to obtain accessToken, accessTokenExpirationDate and refreshToken
   */
  const processAuth = async () => {
    setLoading(true)
    const newSessionResponse = await dispatch(
      NewSessionAuth.action({ serverAddress, clientId }),
    )
    if (isFulfilled(newSessionResponse)) {
      // Get health facility info
      const fetchOneHealthFacility = await dispatch(
        FetchOneHealthFacility.action({}),
      )

      if (isFulfilled(fetchOneHealthFacility)) {
        // Register device in medAl-creator
        const fetchOneAlgorithm = await dispatch(FetchOneAlgorithm.action({}))
        if (isFulfilled(fetchOneAlgorithm)) {
          // Get emergency content
          const fetchOneEmergency = await dispatch(
            FetchOneEmergency.action({
              emergencyContentVersion: -1,
            }),
          )
          if (isFulfilled(fetchOneEmergency)) {
            // Navigate and reset to Pin container
            setLoading(false)
            navigateAndSimpleReset('Study', { source: 'auth' })
          }
        }
      }
      setLoading(false)
    }
  }
  console.log(loading)
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
          <View style={authLogin.buttonWrapper}>
            <SquareButton
              label={t('actions.login')}
              filled
              onPress={processAuth}
            />
          </View>

          <View style={authLogin.buttonWrapper}>
            {healthFacilityFetchOneError && (
              <Text style={auth.errorMessage}>
                {healthFacilityFetchOneError.message}
              </Text>
            )}
            {algorithmFetchOneError && (
              <Text style={auth.errorMessage}>
                {algorithmFetchOneError.message}
              </Text>
            )}
          </View>

          <View style={authLogin.loaderWrapper}>{loading && <Loader />}</View>
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
