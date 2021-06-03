/**
 * The external imports
 */
import React, { useState } from 'react'
import { TextInput } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const String = ({ question, editable = true }) => {
  // Theme and style elements deconstruction

  const {
    Components: { string },
  } = useTheme()

  // Local state definition
  const [value, setValue] = useState('') // TODO: Load answer from medicalCase !

  /**
   * Save value in store
   * TODO: Make it work !
   * @param {Event} e
   */
  const onEndEditing = e => {
    const value = e.nativeEvent.text
    console.log('onEndEditing', value)
  }

  return (
    <TextInput
      style={string.input(editable)}
      onEndEditing={onEndEditing}
      onChangeText={setValue}
      value={value}
      keyboardType="default"
      editable={editable}
    />
  )
}

export default String
