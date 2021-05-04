import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Auth from '@/Store/System/Auth'
import ChangeTheme from '@/Store/Theme/ChangeTheme'
import ChangeEnvironment from '@/Store/System/ChangeEnvironment'

import { useTheme } from '@/Theme'
import { SquareButton, SquareSelect } from '@/Components'
import Loader from '@/Components/Loader'

const IndexAuthContainer = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Colors,
    Fonts,
    Containers: { authIndex },
  } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const [email, setEmail] = useState(
    __DEV__ ? 'quentin.girard@wavemind.ch' : '',
  )
  const [password, setPassword] = useState(__DEV__ ? '123456' : '')
  const [isEnabled, setIsEnabled] = useState(false)

  const authLoading = useSelector(state => state.system.auth.loading)
  const newSessionError = useSelector(state => state.user.newSession.error)
  const registerError = useSelector(state => state.device.register.error)
  const theme = useSelector(state => state.theme)
  const environment = useSelector(state => state.system.environment)

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  /**
   * Dispatches the login credentials to check validity
   */
  const handleLogin = () => {
    dispatch(Auth.action({ email, password }))
  }

  /**
   * Dispatches the theme change action to the store and toggles the local enabled state
   * @param theme
   * @param darkMode
   */
  const changeTheme = ({ newTheme, darkMode }) => {
    dispatch(ChangeTheme.action({ theme: newTheme, darkMode }))
    setIsEnabled(!isEnabled)
  }

  /**
   * Dispatches new environment to store
   * @param newEnvironment
   */
  const updateEnvironment = newEnvironment => {
    dispatch(ChangeEnvironment.action({ newEnvironment }))
  }

  const environments = [
    { label: 'Test', value: 'test' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' },
  ]

  return (
    <Animated.View
      style={[
        Layout.fill,
        Layout.center,
        Layout.justifyContentBetween,
        { opacity: fadeAnim },
      ]}
    >
      <View style={authIndex.formWrapper}>
        <Text style={authIndex.header}>Authentication</Text>
        <TextInput
          style={authIndex.input}
          onChangeText={setEmail}
          value={email}
          autoCompleteType="email"
          placeholder="email"
        />
        <TextInput
          style={authIndex.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCompleteType="password"
          placeholder="password"
        />
        <SquareSelect
          label="Environment"
          items={environments}
          handleOnSelect={updateEnvironment}
          value={environment}
        />
        <View style={authIndex.buttonWrapper}>
          <SquareButton
            content="Login"
            filled
            handlePress={handleLogin}
            disabled={authLoading}
          />
        </View>
        {newSessionError && (
          <Text style={authIndex.errorMessage}>{newSessionError.message}</Text>
        )}
        {registerError && (
          <Text style={Fonts.textRegular}>{registerError.message}</Text>
        )}
      </View>

      {authLoading ? <Loader height={200} /> : null}

      <View style={authIndex.switchOuterWrapper}>
        <Text style={authIndex.switchLabel}>Dark mode</Text>
        <View style={authIndex.switchInnerWrapper}>
          <Switch
            trackColor={{ false: '#767577', true: '#f4f3f4' }}
            thumbColor={isEnabled ? Colors.primary : '#f4f3f4'}
            onValueChange={() =>
              changeTheme({ theme: 'default', darkMode: !theme.darkMode })
            }
            value={isEnabled}
          />
        </View>
      </View>
    </Animated.View>
  )
}

export default IndexAuthContainer
