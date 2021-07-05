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

const Badge = ({ removeBadge, selectedItem, label }) => {
  const {
    Layout,
    FontSize,
    Fonts,
    Colors,
    Components: { badge },
  } = useTheme()

  return (
    <View style={badge.wrapper}>
      <View style={badge.innerWrapper}>
        <Text style={Fonts.textColorSecondary}>
          <Text style={Fonts.textTiny}>{label(selectedItem)}</Text>
        </Text>
      </View>
      <View style={badge.separator} />
      <TouchableOpacity
        style={Layout.column}
        onPress={() => removeBadge(selectedItem)}
      >
        <Icon name="close" size={FontSize.regular} color={Colors.secondary} />
      </TouchableOpacity>
    </View>
  )
}

export default Badge
