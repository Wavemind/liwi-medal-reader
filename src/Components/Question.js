/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import find from 'lodash/find'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { Checkbox, Select, Icon, InputFactory } from '@/Components'
import { Config } from '@/Config'
import UpdateNodeField from '@/Store/MedicalCase/UpdateNodeField'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

const Question = ({ questionId, disabled = false }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const {
    Components: { question },
    Colors,
    FontSize,
  } = useTheme()

  // Get node from algorithm
  const mcNode = useSelector(state => state.medicalCase.item.nodes[questionId])
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [isFullLength] = useState(
    currentNode.display_format === Config.DISPLAY_FORMAT.autocomplete,
  )

  const [descriptionAvailable] = useState(
    translate(currentNode.description) !== '',
  )
  const [isUnavailable, setIsUnavailable] = useState(mcNode.unavailableValue)

  // Node can have an unavailable answer
  const [additionalUnavailableAnswer] = useState(
    find(currentNode.answers, a => a.value === 'not_available'),
  )

  // Is an emergency question
  const [emergency] = useState(
    currentNode.is_danger_sign || currentNode.emergency_status === 'referral',
  )

  /**
   * Used only when normal answer can't be set by clinician. A list of predefined answer are displayed
   */
  const handleUnavailable = () => {
    setIsUnavailable(!isUnavailable)
    dispatch(
      UpdateNodeField.action({
        nodeId: questionId,
        field: 'unavailableValue',
        value: !isUnavailable,
      }),
    )
  }

  /**
   * Used only when isUnavailableAnswer have a value
   */
  const handleUnavailableAnswer = value => {
    const answer = value ? additionalUnavailableAnswer.id : null
    dispatch(SetAnswer.action({ nodeId: questionId, value: answer }))
  }

  return (
    <View style={question.wrapper(emergency)}>
      <View style={question.container}>
        <View style={question.questionWrapper(isFullLength)}>
          {emergency && <Icon name="alert" color={Colors.red} />}

          <Text
            style={
              emergency
                ? question.emergencyText
                : question.text(question.validationType)
            }
          >
            {translate(currentNode.label)} {currentNode.is_mandatory && '*'}
          </Text>

          {(descriptionAvailable || __DEV__) && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('QuestionInfo', {
                  nodeId: questionId,
                })
              }
            >
              <Icon name="simple-info" />
            </TouchableOpacity>
          )}

          <View
            style={
              isFullLength
                ? question.fullLengthInputWrapper
                : question.inputWrapper
            }
          >
            {additionalUnavailableAnswer ? (
              <>
                {mcNode.answer !== additionalUnavailableAnswer.id && (
                  <InputFactory questionId={questionId} emergency={emergency} />
                )}
                <Checkbox
                  label={translate(additionalUnavailableAnswer.label)}
                  defaultValue={
                    mcNode.answer === additionalUnavailableAnswer.id
                  }
                  onPress={handleUnavailableAnswer}
                />
              </>
            ) : isUnavailable ? (
              <Select questionId={questionId} />
            ) : (
              <InputFactory questionId={questionId} emergency={emergency} />
            )}
            {currentNode.unavailable && !additionalUnavailableAnswer && (
              <Checkbox
                label={translate(currentNode.unavailable_label)}
                defaultValue={isUnavailable}
                onPress={handleUnavailable}
              />
            )}
          </View>
        </View>

        {(mcNode.validationType === 'error' ||
          mcNode.validationType === 'warning') && (
          <View style={[question.messageWrapper(question.validationType)]}>
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>{mcNode.validationMessage}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Question
