/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'
import UpdateNodeField from '@/Store/MedicalCase/UpdateNodeField'

const Numeric = ({ question, editable = true }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    Components: { numeric, booleanButton },
    Layout,
    Gutters,
  } = useTheme()

  // Local state definition
  const [value, setValue] = useState('') // TODO: Load answer from medicalCase !
  const [estimableValue, setEstimableValue] = useState(question.estimableValue) // TODO: Load estimable from medicalCase ! (estimableValue)

  /**
   * Save value in store
   * TODO: Make it work !
   * @param {Event} e
   */
  const onEndEditing = async e => {
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

    if (question.value !== value) {
      await dispatch(SetAnswer.action({ nodeId: question.id, value }))
    }
  }

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
  const onChange = newValue => {
    const regWithComma = /^[0-9,]+$/

    // Replace comma with dot
    if (regWithComma.test(newValue)) {
      newValue = newValue.replace(',', '.')
    }

    // Remove char that are not number or dot
    newValue = newValue.replace(/[^0-9.]/g, '')

    // Parse to float if value is not empty and last char is not dot
    if (newValue !== '' && newValue.charAt(newValue.length - 1) !== '.') {
      newValue = parseFloat(newValue)
    }

    setValue(newValue)
  }

  /**
   * Set state and update medicalCase store
   * TODO: Make it work !
   * @param {'measured' | 'estimated'} value
   */
  const handleEstimable = newEstimableValue => {
    setEstimableValue(newEstimableValue)
    dispatch(
      UpdateNodeField.action({
        nodeId: question.id,
        field: 'estimableValue',
        value: newEstimableValue,
      }),
    )
  }

  return (
    <View>
      <TextInput
        style={numeric.input(editable)}
        onEndEditing={onEndEditing}
        keyboardType="decimal-pad"
        onChangeText={onChange}
        value={String(value)}
        editable={editable}
      />
      <View style={[Layout.row, Gutters.smallTMargin]}>
        <View
          key="booleanButton-left"
          style={booleanButton.buttonWrapper(
            'left',
            estimableValue === 'measured',
            !editable,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => handleEstimable('measured')}
            editable={editable}
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
            !editable,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => handleEstimable('estimated')}
            editable={editable}
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
