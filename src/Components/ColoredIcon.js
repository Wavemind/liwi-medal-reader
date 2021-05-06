/**
 * The external imports
 */
import React from 'react'
import { View, Image } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const ColoredIcon = ({ name, height = 200, width = 200, mode = 'contain' }) => {
  // Theme and style elements deconstruction
  const { Layout, Images } = useTheme()
  const darkMode = useSelector(state => state.theme.darkMode)

  const imageTheme = darkMode ? 'dark' : 'light'

  return (
    <View style={{ height, width }}>
      <Image
        style={Layout.fullSize}
        source={Images[`${name}_${imageTheme}`]}
        resizeMode={mode}
      />
    </View>
  )
}

export default ColoredIcon
