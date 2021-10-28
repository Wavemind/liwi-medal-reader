/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import setAnswer from '@/Utils/SetAnswer'
import { translate } from '@/Translations/algorithm'
import { displayResult } from '@/Utils/ReferenceTable'
import { Config } from '@/Config'

const String = ({ questionId, editable = true }) => {
  // Theme and style elements deconstruction
  const {
    Components: { string },
  } = useTheme()

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [value, setValue] = useState(
    question.value === null ? '' : question.value,
  )

  useEffect(() => {
    if (question.value === null) {
      setValue('')
    } else if (currentNode.display_format === Config.DISPLAY_FORMAT.reference) {
      setValue(displayResult(question.value, questionId))
    } else {
      setValue(question.value.toString())
    }
  }, [question.value])

  /**
   * Save value in store
   * @param {Event} e
   */
  const onEndEditing = e => {
    const newValue = e.nativeEvent.text
    if (question.value !== newValue) {
      setAnswer(question.id, newValue)
    }
  }

  return (
    <TextInput
      style={string.input(editable)}
      onEndEditing={onEndEditing}
      onChangeText={setValue}
      value={value.toString()}
      keyboardType="default"
      editable={editable}
      placeholder={
        currentNode.placeholder && translate(currentNode.placeholder)
      }
    />
  )
}

export default String
