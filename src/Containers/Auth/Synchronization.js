import React, { useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { useSelector } from 'react-redux'

import { useTheme } from '@/Theme'

const SynchronizationAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Layout, Fonts } = useTheme()

  // Local state definition
  const state = useSelector(state => state)

  console.log(state)

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
        Synchronization
      </Text>
      <View style={[Layout.colVCenter, { width: 300 }]}>
        <Text style={[Fonts.textColorText]}>small text</Text>
      </View>
    </Animated.View>
  )
}

export default SynchronizationAuthContainer
