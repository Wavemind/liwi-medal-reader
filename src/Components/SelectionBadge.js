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
import { useSelector } from 'react-redux'
import { translate } from '@/Translations/algorithm'

const SelectionBadge = ({ value, handleRemovePress, diagnosisId }) => {
  const {
    Layout,
    FontSize,
    Fonts,
    Colors,
    Components: { badge },
  } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  return (
    <View style={badge.wrapper}>
      <View style={Layout.row}>
        <Text style={Fonts.textColorSecondary}>
          <Text style={Fonts.textTiny}>
            {translate(algorithm.nodes[diagnosisId].label)}
          </Text>
        </Text>
      </View>
      <View style={badge.separator} />
      <TouchableOpacity
        style={Layout.column}
        onPress={() => handleRemovePress(false, diagnosisId)}
      >
        <Icon name="close" color={Colors.secondary} size={FontSize.regular} />
      </TouchableOpacity>
    </View>
  )
}

export default SelectionBadge
