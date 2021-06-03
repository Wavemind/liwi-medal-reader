/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Numeric = ({ question, disabled }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Components: { numeric, booleanButton },
    Layout,
    Colors,
    Gutters,
    Fonts,
  } = useTheme()

  // Local state definition
  const [value, setValue] = useState('') // TODO: Load answer from medicalCase !
  const [estimableValue, setEstimableValue] = useState('measured') // TODO: Load estimable from medicalCase ! (estimableValue)

  /**
   * Save value in store
   * TODO: Make it work !
   * @param {Event} e
   */
  const onEndEditing = e => {
    const value = e.nativeEvent.text
    // const {
    //   app: { algorithm, set },
    //   setAnswer,
    //   setPatientValue,
    //   question,
    //   patientValueEdit,
    // } = this.props;

    // if (patientValueEdit) {
    //   if (value !== question.value && value !== '') {
    //     setPatientValue(question.id, value);
    //   } else if (question.value !== null && value === '') {
    //     setPatientValue(question.id, null);
    //   }
    // } else if (value !== question.value && value !== '') {
    //   setAnswer(algorithm, question.id, value);
    // } else if (question.value !== null && value === '') {
    //   setAnswer(algorithm, question.id, null);
    // }

    // set('answeredQuestionId', question.id);
  }

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
  const onChange = value => {
    const regWithComma = /^[0-9,]+$/

    // Replace comma with dot
    if (regWithComma.test(value)) {
      value = value.replace(',', '.')
    }

    // Remove char that are not number or dot
    value = value.replace(/[^0-9.]/g, '')

    // Parse to float if value is not empty and last char is not dot
    if (value !== '' && value.charAt(value.length - 1) !== '.') {
      value = parseFloat(value)
    }

    setValue(value)
  }

  /**
   * Set state and update medicalCase store
   * TODO: Make it work !
   * @param {'measured' | 'estimated'} value
   */
  const handleEstimable = value => {
    setEstimableValue(value)
  }

  return (
    <View>
      <TextInput
        style={numeric.input}
        onEndEditing={onEndEditing}
        keyboardType="decimal-pad"
        onChangeText={onChange}
        value={String(value)}
        disabled={disabled}
      />
      <View style={[Layout.row, Gutters.smallTMargin]}>
        <View
          key="booleanButton-left"
          style={booleanButton.buttonWrapper(
            'left',
            estimableValue === 'measured',
            disabled,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => handleEstimable('measured')}
            disabled={disabled}
          >
            <Text
              style={booleanButton.buttonText(estimableValue === 'measured')}
            >
              {t('answers.measured')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          key="booleanButton-right"
          style={booleanButton.buttonWrapper(
            'right',
            estimableValue === 'estimated',
            disabled,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => handleEstimable('estimated')}
            disabled={disabled}
          >
            <Text
              style={booleanButton.buttonText(estimableValue === 'estimated')}
            >
              {t('answers.estimated')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Numeric
