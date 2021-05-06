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
  const { name, style } = props
  const { Colors, Fonts } = useTheme()

  return (
    <CustomIcon
      name={name}
      style={[Fonts.textLarge, { color: Colors.primary }, { ...style }]}
    />
  )
}

export default Icon
