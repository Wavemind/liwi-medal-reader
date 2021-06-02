/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox, Icon } from '@/Components'

const DiagnosisItem = ({ item }) => {
  // Theme and style elements deconstruction
  const {
    Components: { diagnosisItem },
    Layout,
    Gutters,
    Colors,
    FontSize,
  } = useTheme()
  const dispatch = useDispatch()

  return (
    <View style={diagnosisItem.wrapper}>
      <Checkbox label={item.label.en} />
    </View>
  )
}

export default DiagnosisItem
