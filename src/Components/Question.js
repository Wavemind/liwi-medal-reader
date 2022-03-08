/**
 * The external imports
 */
import React, { useMemo } from 'react'
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
  DisplayUnavailable,
  QuestionInfoButton,
  InputFactory,
} from '@/Components'
import { Config } from '@/Config'

const Question = ({ questionId, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { question },
    FontSize,
    Colors,
  } = useTheme()

  const validationType = useSelector(
    state => state.medicalCase.item.nodes[questionId].validationType,
  )
  const validationMessage = useSelector(
    state => state.medicalCase.item.nodes[questionId].validationMessage,
  )
  const fieldError = useSelector(state => state.validation.item[questionId])
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  const isFullLength = useMemo(
    () => currentNode.display_format === Config.DISPLAY_FORMAT.autocomplete,
    [],
  )
  const descriptionAvailable = useMemo(
    () => translate(currentNode.description) !== '',
    [],
  )
  const additionalUnavailableAnswer = useMemo(
    () => find(currentNode.answers, a => a.value === 'not_available'),
    [],
  )
  const questionLabel = useMemo(() => translate(currentNode.label), [])
  const mediaAvailable = useMemo(() => currentNode.medias?.length > 0, [])

  // Is an emergency question
  const emergency = useMemo(
    () =>
      currentNode.emergency_status === 'referral' ||
      currentNode.emergency_status === 'emergency',
    [currentNode],
  )

  return (
    <View style={question.wrapper(emergency)}>
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
            {questionLabel}&nbsp;
            {currentNode.is_mandatory && '*'}
          </Text>

          {(descriptionAvailable || mediaAvailable || __DEV__) && (
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
              <DisplayUnavailable questionId={questionId} />
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
            <Icon size={FontSize.regular} color={Colors.white} name="warning" />
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
