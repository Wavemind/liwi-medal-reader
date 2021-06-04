/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
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
   * TODO: Make it work !
   * @param {Event} e
   */
  const onEndEditing = e => {
    const value = e.nativeEvent.text
    console.log('onEndEditing', value)
  }

  useEffect(() => {
    if (question.value !== value) {
      dispatch(SetAnswer.action({ nodeId: question.id, value }))
    }
  }, [value])

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
