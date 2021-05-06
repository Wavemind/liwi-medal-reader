/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import ChangeEnvironment from '@/Store/System/ChangeEnvironment'
import { useTheme } from '@/Theme'
import { Config } from '@/Config'
import { SquareButton, SquareSelect } from '@/Components'
import Loader from '@/Components/Loader'
import ToggleSwitch from '@/Components/ToggleSwitch'
import NewSessionUser from '@/Store/User/NewSession'
import DeviceRegister from '@/Store/Device/Register'
import { navigateAndSimpleReset } from '@/Navigators/Root'

const LoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin },
  } = useTheme()

  // Local state definition
  const [email, setEmail] = useState(
    __DEV__ ? 'quentin.girard@wavemind.ch' : '',
  )
  const [password, setPassword] = useState(__DEV__ ? '123456' : '')
  const [loading, setLoading] = useState(false)

  // Get values from the store
  const newSessionError = useSelector(state => state.user.newSession.error)
  const registerError = useSelector(state => state.device.register.error)
  const environment = useSelector(state => state.system.environment)

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  const dispatch = useDispatch()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  /**
   * Dispatches the login credentials to check validity and register the device
   */
  const handleLogin = async () => {
    setLoading(true)

    // Dispatches the user information to open a new session
    const newSessionUser = await dispatch(
      NewSessionUser.action({ email, password }),
    )

    if (isFulfilled(newSessionUser)) {
      // Register device in medAl-creator
      const deviceRegister = await dispatch(DeviceRegister.action({}))

      if (isFulfilled(deviceRegister)) {
        // Navigate and reset to Synchronization container
        navigateAndSimpleReset('Synchronization')
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  /**
   * Dispatches new environment to store
   * @param newEnvironment
   */
  const updateEnvironment = newEnvironment => {
    dispatch(ChangeEnvironment.action({ newEnvironment }))
  }

  return (
    <KeyboardAvoidingView behavior="height" style={auth.wrapper}>
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>{t('containers.auth.login.title')}</Text>
        <View style={authLogin.errorMessageWrapper}>
          {newSessionError && (
            <Text style={auth.errorMessage}>{newSessionError.message}</Text>
          )}
          {registerError && (
            <Text style={auth.errorMessage}>{registerError.message}</Text>
          )}
        </View>

        <View style={authLogin.formWrapper}>
          <TextInput
            style={authLogin.input}
            onChangeText={setEmail}
            value={email}
            autoCompleteType="email"
            placeholder={t('containers.auth.login.email')}
          />
          <TextInput
            style={authLogin.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            autoCompleteType="password"
            placeholder={t('containers.auth.login.password')}
          />
          <SquareSelect
            label={t('containers.auth.login.environment')}
            items={Config.ENVIRONNEMENTS}
            handleOnSelect={updateEnvironment}
            value={environment}
          />
          <View style={authLogin.buttonWrapper}>
            <SquareButton
              content={t('actions.login')}
              filled
              handlePress={handleLogin}
              disabled={loading}
            />
          </View>
        </View>

        <View style={authLogin.loaderContainer}>
          {loading && <Loader height={100} />}
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitch label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default LoginAuthContainer