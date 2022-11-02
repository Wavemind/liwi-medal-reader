/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Loader } from '@/Components'

const OverlayLoader = () => {
  // Theme and style elements deconstruction
  const {
    Components: { overlayLoader },
  } = useTheme()

  return (
    <View style={overlayLoader.container}>
      <Loader />
    </View>
  )
}

export default OverlayLoader
