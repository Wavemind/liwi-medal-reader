/**
 * The external imports
 */
import React from 'react'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'

/**
 * The internal imports
 */
import icoMoonConfig from '../../Assets/Fonts/selection.json'
import { FontSize, Colors } from '@/Theme/Variables'

const CustomIcon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'medAl-reader',
  'medAl-reader.ttf',
)

const Icon = ({
  name,
  color = Colors.primary,
  size = FontSize.large,
  style,
}) => {
  return (
    <CustomIcon
      name={name}
      style={[{ color: color, fontSize: size }, { ...style }]}
    />
  )
}

export default Icon
