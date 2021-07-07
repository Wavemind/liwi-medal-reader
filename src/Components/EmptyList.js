/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const EmptyList = ({ text }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Gutters,
    Containers: { finalDiagnoses },
  } = useTheme()

  return (
    <View style={[Layout.alignItemsCenter, Gutters.regularTMargin]}>
      <Text style={finalDiagnoses.emptyQuestions}>{text}</Text>
    </View>
  )
}

export default EmptyList
