/**
 * The external imports
 */
import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

const String = ({ question, editable = true }) => {
  // Theme and style elements deconstruction
  const dispatch = useDispatch()

  const {
    Components: { string },
  } = useTheme()

  // Local state definition
  const [value, setValue] = useState('') // TODO: Load answer from medicalCase !

  /**
   * Save value in store
   * @param {Event} e
   */
  const onEndEditing = e => {
    const newValue = e.nativeEvent.text
    if (question.value !== newValue) {
      dispatch(SetAnswer.action({ nodeId: question.id, value: newValue }))
    }
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
