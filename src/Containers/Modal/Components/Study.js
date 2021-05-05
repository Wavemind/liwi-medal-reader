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

const Study = () => {
  // Props deconstruction

  // Theme and style elements deconstruction
  const {
    Containers: { modalAlgorithm },
  } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  return (
    <View style={modalAlgorithm.wrapper}>
      <WebView
        source={{ html: algorithm?.study.description }}
        scalesPageToFit={false}
      />
    </View>
  )
}

export default Study
