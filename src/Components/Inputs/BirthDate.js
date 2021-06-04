/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Date } from '@/Components'

const BirthDate = () => {
  // Theme and style elements deconstruction
  const {
    Components: { question },
  } = useTheme()

  return (
    <View style={question.wrapper(false)}>
      <View style={question.container}>
        <View style={question.questionWrapper(false)}>
          <Text style={question.text('')} />
          <View style={question.inputWrapper}>
            <Date />
          </View>
        </View>
      </View>
    </View>
  )
}

export default BirthDate
