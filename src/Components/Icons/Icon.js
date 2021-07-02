/**
 * The external imports
 */
import React from 'react'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'

/**
 * The internal imports
 */
import icoMoonConfig from '../../Assets/Fonts/selection.json'
import { FontSize } from '@/Theme/Variables'
import { useTheme } from '@/Theme'

const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'medAl-reader',
  'medAl-reader.ttf',
)

const Icon = ({ name, color, size = FontSize.large, style }) => {
  const { Colors } = useTheme()

  const iconColor = color || Colors.primary

  return (
    <CustomIcon
      name={name}
      style={[{ color: iconColor, fontSize: size }, { ...style }]}
    />
  )
}

export default Icon
