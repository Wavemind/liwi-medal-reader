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

import NewSession from '@/Store/Auth/NewSession'
import { useTheme } from '@/Theme'
import { SquareButton, SquareSelect } from '@/Components'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const IndexAuthContainer = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Colors,
    Containers: { authIndex },
  } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const [email, setEmail] = useState(
    __DEV__ ? 'quentin.girard@wavemind.ch' : '',
  )
  const [password, setPassword] = useState(__DEV__ ? '123456' : '')
  const newSessionLoading = useSelector(state => state.auth.newSession.loading)
  const newSessionError = useSelector(state => state.auth.newSession.error)
  const [isEnabled, setIsEnabled] = useState(false)

  const state = useSelector(state => state)

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  /**
   * Dispatches the login credentials to check validity
   */
  const handleLogin = () => {
    dispatch(NewSession.action({ email, password }))
  }

  /**
   * Dispatches the theme change action to the store and toggles the local enabled state
   * @param theme
   * @param darkMode
   */
  const changeTheme = ({ theme, darkMode }) => {
    dispatch(ChangeTheme.action({ theme, darkMode }))
    setIsEnabled(!isEnabled)
  }

  const updateEnvironmentStore = newEnvironment => {}

  const environments = [
    { label: 'Test', value: 'test' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' },
  ]

  return (
    <Animated.View style={[Layout.fill, Layout.center, { opacity: fadeAnim }]}>
      <Text style={authIndex.header}>Authentication</Text>
      <View style={authIndex.formWrapper}>
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
        <View style={authIndex.buttonWrapper}>
          <SquareButton content="Login" filled handlePress={handleLogin} />
        </View>
        {newSessionLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {newSessionError && (
          <Text style={authIndex.errorMessage}>{newSessionError.message}</Text>
        )}

        <View style={authIndex.switchWrapper}>
          <Text style={authIndex.switchLabel}>Dark mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#f4f3f4' }}
            thumbColor={isEnabled ? Colors.primary : '#f4f3f4'}
            onValueChange={() =>
              changeTheme({ theme: 'default', darkMode: !state.theme.darkMode })
            }
            value={isEnabled}
          />
        </View>

        <SquareSelect
          label="Environment"
          items={environments}
          handleOnSelect={updateEnvironmentStore}
        />
      </View>
    </Animated.View>
  )
}

export default IndexAuthContainer
