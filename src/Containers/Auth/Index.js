import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import NewSession from '@/Store/Auth/NewSession'
import { useTheme } from '@/Theme'

const IndexAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Gutters, Layout, Fonts } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const [email, setEmail] = useState(__DEV__ ? 'quentin.girard@wavemind.ch' : '')
  const [password, setPassword] = useState(__DEV__ ? '123456' : '')
  const newSessionLoading = useSelector(state => state.auth.newSession.loading)
  const newSessionError = useSelector(state => state.auth.newSession.error)

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handleLogin = () => {
    dispatch(NewSession.action(email, password))
  }

  return (
    <Animated.View style={[Layout.fill, Layout.center, { opacity: fadeAnim }]}>
      <Text style={[Fonts.textColorText, Fonts.titleSmall]}>
        Authentication
      </Text>
      <View style={[Layout.colVCenter, Layout.alignItemsStart]}>
        <TextInput
          style={{ height: 40, width: 300, margin: 12, borderWidth: 1 }}
          onChangeText={setEmail}
          value={email}
          autoCompleteType="email"
          placeholder="email"
        />
        <TextInput
          style={{ height: 40, width: 300, margin: 12, borderWidth: 1 }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCompleteType="password"
          placeholder="password"
        />
        <TouchableOpacity
          onPress={() => handleLogin()}
          style={[
            {
              height: 40,
              width: 300,
              alignItems: 'center',
              backgroundColor: '#DDDDDD',
              padding: 10,
              margin: 12,
            },
          ]}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        {newSessionLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {newSessionError && (
          <Text style={Fonts.textRegular}>{newSessionError.message}</Text>
        )}
      </View>
    </Animated.View>
  )
}

export default IndexAuthContainer
