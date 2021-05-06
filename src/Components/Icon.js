/**
 * The external imports
 */
import React from 'react'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import { useTheme } from '@/Theme'

/**
 * The internal imports
 */
import icoMoonConfig from '../Assets/Fonts/selection.json'

const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'medAl-reader',
  'medAl-reader.ttf',
)

const Icon = props => {
  const { Colors, Fonts } = useTheme()
  const { name, color = Colors.primary, style } = props

  return (
    <CustomIcon
      name={name}
      style={[Fonts.textLarge, { color: color }, { ...style }]}
    />
  )
}

export default Icon
