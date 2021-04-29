import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Animated, TextInput, TouchableOpacity } from 'react-native'

import { useTheme } from '@/Theme'

const IndexAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Gutters, Layout, Fonts } = useTheme()

  // Local state definition
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

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
      </View>
    </Animated.View>
  )
}

export default IndexAuthContainer
