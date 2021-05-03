import React, { useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'

import { useTheme } from '@/Theme'

const PinAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Layout, Fonts } = useTheme()

  // Local state definition
  const fadeAnim = useRef(new Animated.Value(0)).current

  console.log('Dans le pin')

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View style={[Layout.fill, Layout.center, { opacity: fadeAnim }]}>
      <Text style={[Fonts.textColorText, Fonts.titleSmall]}>Pin</Text>
      <View style={[Layout.colVCenter, { width: 300 }]}>
        <Text style={Fonts.textRegular}>Test</Text>
      </View>
    </Animated.View>
  )
}

export default PinAuthContainer
