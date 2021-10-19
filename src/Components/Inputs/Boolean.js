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
import SetParams from '@/Store/Modal/SetParams'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'
import setAnswer from '@/Utils/SetAnswer'

const Boolean = ({ questionId, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { booleanButton },
    Layout,
  } = useTheme()
  const dispatch = useDispatch()

  // Get node from algorithm
  const answer = useSelector(
    state => state.medicalCase.item.nodes[questionId].answer,
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [value, setValue] = useState(answer)

  const [yesAnswer] = useState(getYesAnswer(currentNode))
  const [noAnswer] = useState(getNoAnswer(currentNode))

  /**
   * Set node answer and handle emergency action
   * @param {integer} answerId
   */
  const setLocalAnswer = async answerId => {
    if (
      currentNode.emergency_status === 'emergency' &&
      currentNode.emergency_answer_id === answerId
    ) {
      await dispatch(SetParams.action({ type: 'emergency' }))
      await dispatch(ToggleVisibility.action({}))
    }
    setValue(answerId)
  }

  /**
   * Update value in store when value changes
   */
  useEffect(() => {
    if (answer !== value) {
      setAnswer(questionId, value)
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
          onPress={() => setLocalAnswer(yesAnswer.id)}
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
          onPress={() => setLocalAnswer(noAnswer.id)}
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
