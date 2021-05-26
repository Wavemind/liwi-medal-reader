/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

function Emergency() {
  const {
    Containers: { modalAlgorithm },
  } = useTheme()

  const emergencyContent = useSelector(state => state.emergency.content)

  return (
    <View style={modalAlgorithm.wrapper}>
      <WebView source={{ html: emergencyContent }} scalesPageToFit={false} />
    </View>
  )
}

export default Emergency
