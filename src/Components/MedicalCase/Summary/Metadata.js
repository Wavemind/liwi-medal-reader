/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Metadata = ({ label, value }) => {
  const {
    Layout,
    Fonts,
    Components: { metadata },
  } = useTheme()

  return (
    <View style={Layout.row}>
      <View style={metadata.column}>
        <Text style={Fonts.textSmall}>{label}</Text>
      </View>
      <View style={metadata.column}>
        <Text style={metadata.value}>{value}</Text>
      </View>
    </View>
  )
}

export default Metadata
