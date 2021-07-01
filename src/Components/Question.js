/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import find from 'lodash/find'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import {
  Icon,
  DisplayInput,
  QuestionInfoButton,
  InputFactory,
} from '@/Components'
import { Config } from '@/Config'
import { store } from '@/Store'

const Question = ({ questionId, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { question },
    FontSize,
    Colors,
  } = useTheme()

  // Get node from algorithm
  const validationType = useSelector(
    state => state.medicalCase.item.nodes[questionId].validationType,
  )
  const validationMessage = useSelector(
    state => state.medicalCase.item.nodes[questionId].validationMessage,
  )
  const fieldError = useSelector(state => state.validation.item[questionId])

  const [currentNode] = useState(
    store.getState().algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [isFullLength] = useState(
    currentNode.display_format === Config.DISPLAY_FORMAT.autocomplete,
  )

  const [descriptionAvailable] = useState(
    translate(currentNode.description) !== '',
  )

  // Node can have an unavailable answer
  const [additionalUnavailableAnswer] = useState(
    find(currentNode.answers, a => a.value === 'not_available'),
  )

  // Is an emergency question
  const emergency =
    currentNode.emergency_status === 'referral' ||
    currentNode.emergency_status === 'emergency'

  return (
    <View style={[question.wrapper(emergency)]}>
      <View style={question.container}>
        <View style={question.questionWrapper(isFullLength)}>
          {emergency && <Icon name="alert" color={Colors.red} />}

          <Text
            style={
              emergency
                ? question.emergencyText
                : question.text(fieldError ? 'error' : validationType)
            }
          >
            {translate(currentNode.label)} {currentNode.is_mandatory && '*'}
          </Text>

          {(descriptionAvailable || __DEV__) && (
            <QuestionInfoButton nodeId={questionId} />
          )}

          <View
            style={
              isFullLength
                ? question.fullLengthInputWrapper
                : question.inputWrapper
            }
          >
            {currentNode.unavailable || additionalUnavailableAnswer ? (
              <DisplayInput questionId={questionId} />
            ) : (
              <InputFactory questionId={questionId} />
            )}
          </View>
        </View>

        {(validationType === 'error' ||
          validationType === 'warning' ||
          fieldError) && (
          <View
            style={[
              question.messageWrapper(fieldError ? 'error' : validationType),
            ]}
          >
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>
              {validationMessage ? validationMessage : fieldError}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Question
