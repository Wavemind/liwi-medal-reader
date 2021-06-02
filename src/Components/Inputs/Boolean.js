/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { getYesAnswer, getNoAnswer } from '@/Utils/Answers'
import DefineType from '@/Store/Modal/DefineType'
import ToggleVisbility from '@/Store/Modal/ToggleVisibility'

const Boolean = ({ question, emergency, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { booleanButton },
    Layout,
  } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const [value, setValue] = useState(question.answer)

  const yesAnswer = getYesAnswer(question)
  const noAnswer = getNoAnswer(question)

  /**
   * Set node answer and handle emergency action
   * @param {integer} answerId
   */
  const setAnswer = async answerId => {
    if (emergency && yesAnswer.id === answerId) {
      await dispatch(DefineType.action({ type: 'emergency' }))
      await dispatch(ToggleVisbility.action({}))
    }
    setValue(answerId)
  }

  return (
    <>
      <View
        key="booleanButton-left"
        style={booleanButton.buttonWrapper(
          'left',
          value === yesAnswer.id,
          disabled,
        )}
      >
        <TouchableOpacity
          style={Layout.center}
          onPress={() => setAnswer(yesAnswer.id)}
          disabled={disabled}
        >
          <Text style={booleanButton.buttonText(value === yesAnswer.id)}>
            {translate(yesAnswer.label)}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        key="booleanButton-right"
        style={booleanButton.buttonWrapper(
          'right',
          value === noAnswer.id,
          disabled,
        )}
      >
        <TouchableOpacity
          style={Layout.center}
          onPress={() => setAnswer(noAnswer.id)}
          disabled={disabled}
        >
          <Text style={booleanButton.buttonText(value === noAnswer.id)}>
            {translate(noAnswer.label)}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Boolean
