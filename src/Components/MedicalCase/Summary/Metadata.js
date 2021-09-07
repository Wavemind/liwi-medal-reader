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
  const { Layout, Fonts } = useTheme()

  return (
    <View style={Layout.row}>
      <View style={[Layout.fill, Layout.column]}>
        <Text style={Fonts.textSmall}>{label}</Text>
      </View>
      <View style={[Layout.fill, Layout.column]}>
        <Text style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}>
          {value}
        </Text>
      </View>
    </View>
  )
}

export default Metadata
