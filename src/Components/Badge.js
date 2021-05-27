/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const Badge = ({ filterBy, value }) => {
  const {
    Layout,
    FontSize,
    Fonts,
    Colors,
    Components: { badge },
  } = useTheme()

  return (
    <View style={badge.wrapper}>
      <View style={Layout.row}>
        <Text style={Fonts.textColorSecondary}>
          {filterBy} : <Text style={Fonts.textBold}>{value}</Text>
        </Text>
      </View>
      <View style={badge.separator} />
      <TouchableOpacity
        style={Layout.column}
        onPress={() => console.log('TODO')}
      >
        <Icon name="close" color={Colors.secondary} size={FontSize.regular} />
      </TouchableOpacity>
    </View>
  )
}

export default Badge
