/**
 * The external imports
 */
import React from 'react'
import { View, Text, Button } from 'react-native'
import { WebView } from 'react-native-webview';

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const AlgorithmInfo = props => {
  // Props deconstruction
  const { algorithm } = props

  // Theme and style elements deconstruction
  const { Containers: { modalAlgorithm} } = useTheme()

  return (
    <View style={modalAlgorithm.wrapper}>
      <WebView source={{ html: algorithm.study.description }} scalesPageToFit={false} />
    </View>
  )
}

export default AlgorithmInfo
