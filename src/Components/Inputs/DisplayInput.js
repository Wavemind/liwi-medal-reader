/**
 * The external imports
 */
import React, { useState } from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import find from 'lodash/find'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { Checkbox, Select, InputFactory } from '@/Components'
import { Config } from '@/Config'
import { store } from '@/Store'
import UpdateNodeField from '@/Store/MedicalCase/UpdateNodeField'
import { setAnswer } from '@/Utils/Answers'

const DisplayInput = ({ questionId }) => {
  // Theme and style elements deconstruction
  const dispatch = useDispatch()
  const {
    Components: { question },
  } = useTheme()

  const unavailableValue = useSelector(
    state => state.medicalCase.item.nodes[questionId].unavailableValue,
  )
  const answer = useSelector(
    state => state.medicalCase.item.nodes[questionId].answer,
  )
  const [currentNode] = useState(
    store.getState().algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [isFullLength] = useState(
    currentNode.display_format === Config.DISPLAY_FORMAT.autocomplete,
  )

  const [isUnavailable, setIsUnavailable] = useState(unavailableValue)

  // Node can have an unavailable answer
  const [additionalUnavailableAnswer] = useState(
    find(currentNode.answers, a => a.value === 'not_available'),
  )

  /**
   * Used only when normal answer can't be set by clinician. A list of predefined answer are displayed
   */
  const handleUnavailable = async () => {
    await dispatch(
      UpdateNodeField.action({
        nodeId: questionId,
        field: 'unavailableValue',
        value: !isUnavailable,
      }),
    )
    if (isUnavailable) {
      await setAnswer(questionId, '')
    }
    setIsUnavailable(!isUnavailable)
  }

  /**
   * Used only when isUnavailableAnswer have a value
   */
  const handleUnavailableAnswer = value => {
    const newAnswer = value ? additionalUnavailableAnswer.id : null
    setAnswer(questionId, newAnswer)
  }

  return (
    <>
      {additionalUnavailableAnswer ? (
        <>
          {answer !== additionalUnavailableAnswer.id && (
            <InputFactory questionId={questionId} />
          )}
          <Checkbox
            label={translate(additionalUnavailableAnswer.label)}
            defaultValue={answer === additionalUnavailableAnswer.id}
            onPress={handleUnavailableAnswer}
          />
        </>
      ) : isUnavailable ? (
        <Select questionId={questionId} />
      ) : (
        <InputFactory questionId={questionId} />
      )}
      {currentNode.unavailable && !additionalUnavailableAnswer && (
        <Checkbox
          label={translate(currentNode.unavailable_label)}
          defaultValue={isUnavailable}
          onPress={handleUnavailable}
        />
      )}
    </>
  )
}

export default DisplayInput
