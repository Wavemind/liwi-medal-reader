/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { Boolean, Select, Numeric, Icon } from '@/Components'

import { Config } from '@/Config'

const Question = ({ node, disabled = false }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const {
    Components: { question },
    Colors,
    FontSize,
  } = useTheme()

  // Local state definition
  const [descriptionAvailable, setDescriptionAvailable] = useState(false)
  const [emergency, setEmergency] = useState(false)

  /**
   * For display proposed
   * Available
   * - empty string
   * - error
   * - warning
   * - emergency
   */
  const [status, setStatus] = useState('')

  useEffect(() => {
    setDescriptionAvailable(translate(node.description) !== '')

    if (node.is_danger_sign || node.emergency_status === 'referral') {
      setEmergency(true)
      setStatus('emergency')
    }
  }, [node.description, node.emergency_status, node.is_danger_sign])

  const inputFactory = () => {
    switch (node.display_format) {
      case Config.DISPLAY_FORMAT.radioButton:
        return <Boolean question={node} emergency={emergency} />
      case Config.DISPLAY_FORMAT.input:
        return <Numeric question={node} />
      // case Config.DISPLAY_FORMAT.string:
      //   return <String question={node} />
      // case Config.DISPLAY_FORMAT.date:
      //   return <Date question={node} />
      case Config.DISPLAY_FORMAT.dropDownList:
        return <Select question={node} />
      // case Config.DISPLAY_FORMAT.reference:
      // case Config.DISPLAY_FORMAT.formula:
      //   return <Formula question={node} />
      default:
        return <Text>{translate(node.label)}</Text>
    }
  }

  return (
    <View style={question.wrapper(emergency)}>
      <View style={question.container}>
        <View style={question.questionWrapper}>
          {emergency && <Icon name="alert" color={Colors.red} />}

          <Text style={question.text(status)}>
            {translate(node.label)} {node.is_mandatory && '*'}
          </Text>

          {descriptionAvailable && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('InfoModal', {
                  type: 'question',
                  nodeId: node.id,
                })
              }
            >
              <Icon name="simple-info" />
            </TouchableOpacity>
          )}

          <View style={question.inputWrapper}>{inputFactory()}</View>
        </View>
        {(status === 'error' || status === 'warning') && (
          <View style={question.messageWrapper(status)}>
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>TODO ADD MESSAGE</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Question