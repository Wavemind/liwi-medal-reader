/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import find from 'lodash/find'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import {
  Checkbox,
  Boolean,
  Select,
  Numeric,
  String,
  Date,
  Toggle,
  Icon,
} from '@/Components'
import { Config } from '@/Config'
import UpdateNodeField from '@/Store/MedicalCase/UpdateNodeField'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

const Question = ({ node, disabled = false }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const {
    Components: { question },
    Colors,
    FontSize,
  } = useTheme()

  // Get node from algorithm
  const algorithm = useSelector(state => state.algorithm.item)
  const currentNode = algorithm.nodes[node.id]

  // Local state definition
  const [descriptionAvailable] = useState(
    translate(currentNode.description) !== '',
  )
  const [isUnavailable, setIsUnavailable] = useState(node.unavailableValue)

  // Node can have an unavailable answer
  const [additionalUnavailableAnswer] = useState(
    find(currentNode.answers, a => a.value === 'not_available'),
  )

  // Is an emergency question
  const [emergency] = useState(
    currentNode.is_danger_sign || currentNode.emergency_status === 'referral',
  )

  /**
   * Display correct input based on display format given by algorithm
   */
  const inputFactory = () => {
    switch (currentNode.display_format) {
      case Config.DISPLAY_FORMAT.radioButton:
        if (currentNode.category === Config.CATEGORIES.complaintCategory) {
          return <Toggle question={node} />
        } else {
          return <Boolean question={node} emergency={emergency} />
        }
      case Config.DISPLAY_FORMAT.input:
        return <Numeric question={node} />
      case Config.DISPLAY_FORMAT.string:
        return <String question={node} />
      case Config.DISPLAY_FORMAT.autocomplete:
      // return <Autocomplete question={node} />
      case Config.DISPLAY_FORMAT.date:
        return <Date question={node} />
      case Config.DISPLAY_FORMAT.dropDownList:
        return <Select question={node} />
      case Config.DISPLAY_FORMAT.reference:
      case Config.DISPLAY_FORMAT.formula:
        return <String question={node} editable={false} />
      default:
        return <Text>{translate(currentNode.label)}</Text>
    }
  }

  /**
   * Used only when normal answer can't be set by clinician. A list of predefined answer are displayed
   */
  const handleUnavailable = () => {
    setIsUnavailable(!isUnavailable)
    dispatch(
      UpdateNodeField.action({
        nodeId: node.id,
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
    dispatch(SetAnswer.action({ nodeId: node.id, value: answer }))
  }

  return (
    <View style={question.wrapper(emergency)}>
      <View style={question.container}>
        <View style={question.questionWrapper}>
          {emergency && <Icon name="alert" color={Colors.red} />}

          <Text
            style={
              emergency
                ? question.emergencyText
                : question.text(node.validationType)
            }
          >
            {translate(currentNode.label)} {currentNode.is_mandatory && '*'}
          </Text>

          {descriptionAvailable && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('QuestionInfo', {
                  nodeId: node.id,
                })
              }
            >
              <Icon name="simple-info" />
            </TouchableOpacity>
          )}

          <View style={question.inputWrapper}>
            {additionalUnavailableAnswer ? (
              <>
                {node.answer !== additionalUnavailableAnswer.id &&
                  inputFactory()}
                <Checkbox
                  label={translate(additionalUnavailableAnswer.label)}
                  defaultValue={node.answer === additionalUnavailableAnswer.id}
                  onPress={handleUnavailableAnswer}
                />
              </>
            ) : isUnavailable ? (
              <Select question={node} />
            ) : (
              inputFactory()
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

        {(node.validationType === 'error' ||
          node.validationType === 'warning') && (
          <View style={[question.messageWrapper(node.validationType)]}>
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>{node.validationMessage}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Question
