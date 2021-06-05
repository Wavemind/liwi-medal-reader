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
import UpdateField from '@/Store/Patient/UpdateField'

const PatientString = ({ field }) => {
  // Theme and style elements deconstruction
  const {
    Components: { question, string },
  } = useTheme()

  // Local state definition
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const patient = useSelector(state => state.patient.item)
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
          <Text style={question.text('')}>{t(`patient.${field}`)}</Text>
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
      </View>
    </View>
  )
}

export default PatientString
