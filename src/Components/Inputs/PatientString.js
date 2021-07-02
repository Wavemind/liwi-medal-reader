/**
 * The external imports
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, TextInput } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import UpdateField from '@/Store/Patient/UpdateField'

const PatientString = ({ field }) => {
  // Theme and style elements deconstruction
  const {
    Components: { question, string },
    FontSize,
    Colors,
  } = useTheme()

  // Local state definition
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const patient = useSelector(state => state.patient.item)
  const fieldError = useSelector(state => state.validation.item[field])

  const [value, setValue] = useState(patient[field])

  /**
   * Save value in patient store
   * @param {Event} e
   */
  const onEndEditing = e => {
    const newValue = e.nativeEvent.text
    dispatch(UpdateField.action({ field, value: newValue }))
  }

  return (
    <View style={question.wrapper(false)}>
      <View style={question.container}>
        <View style={question.questionWrapper(false)}>
          <Text style={question.text(fieldError ? 'error' : null)}>
            {t(`patient.${field}`)} *
          </Text>
          <View style={question.inputWrapper}>
            <TextInput
              style={string.input(true)}
              onEndEditing={onEndEditing}
              onChangeText={setValue}
              value={value}
              keyboardType="default"
            />
          </View>
        </View>
        {fieldError && (
          <View style={[question.messageWrapper(fieldError ? 'error' : null)]}>
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>{fieldError}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default PatientString
