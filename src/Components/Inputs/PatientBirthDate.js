/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import BirthDate from './BirthDate'

const PatientBirthDate = () => {
  // Theme and style elements deconstruction
  const {
    Components: { question },
    FontSize,
    Colors,
  } = useTheme()

  const { t } = useTranslation()

  const birthDateError = useSelector(state => state.validation.item.birth_date)
  const birthDateEstimated = useSelector(
    state => state.patient.item.birth_date_estimated,
  )

  return (
    <View style={question.wrapper(false)}>
      <View style={question.container}>
        <View style={question.questionWrapper(false)}>
          <Text style={question.text(birthDateError ? 'error' : null)}>
            {birthDateEstimated
              ? t('patient.estimated_age')
              : t('patient.birth_date')}
            *
          </Text>
          <View style={question.inputWrapper}>
            <BirthDate />
          </View>
        </View>
        {birthDateError && (
          <View
            style={[question.messageWrapper(birthDateError ? 'error' : null)]}
          >
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>{birthDateError}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default PatientBirthDate
