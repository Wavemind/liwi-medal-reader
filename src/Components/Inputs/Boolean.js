/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { getYesAnswer, getNoAnswer } from '@/Utils/Answers'
import DefineType from '@/Store/Modal/DefineType'
import ToggleVisbility from '@/Store/Modal/ToggleVisibility'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

const Boolean = ({ questionId, emergency, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { booleanButton },
    Layout,
  } = useTheme()
  const dispatch = useDispatch()

  // Get node from algorithm
  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[question.id],
  )

  // Local state definition
  const [value, setValue] = useState(question.answer)

  const yesAnswer = getYesAnswer(currentNode)
  const noAnswer = getNoAnswer(currentNode)

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

  /**
   * Update value in store when value changes
   */
  useEffect(() => {
    if (question.value !== value) {
      dispatch(SetAnswer.action({ nodeId: question.id, value }))
    }
  }, [value])

  return (
    <View style={Layout.row}>
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
    </View>
  )
}

export default Boolean
