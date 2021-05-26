/**
 * The external imports
 */
import React from 'react'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import icoMoonConfig from '../../Assets/Fonts/selection.json'

const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'medAl-reader',
  'medAl-reader.ttf',
)

const Icon = props => {
  const { Colors, FontSize } = useTheme()
  const { name, color = Colors.primary, size = FontSize.large, style } = props

  return (
    <CustomIcon
      name={name}
      style={[{ color: color, fontSize: size }, { ...style }]}
    />
  )
}

export default Icon
