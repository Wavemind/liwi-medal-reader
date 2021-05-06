/**
 * The external imports
 */
import React from 'react'
import { View, Text, Button } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const QuestionInfo = props => {
  // Props deconstruction
  const { algorithm } = props

  // Theme and style elements deconstruction
  const { Gutters, Layout, Fonts } = useTheme()

  return (
    <View>
      <Text>This is the question view</Text>
    </View>
  )
}

export default QuestionInfo
