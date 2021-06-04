/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import Date from './Date'

const BirthDate = () => {
  // Theme and style elements deconstruction
  const {
    Components: { question },
  } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={question.wrapper(false)}>
      <View style={question.container}>
        <View style={question.questionWrapper}>
          <Text style={question.text('')}>{t('patient.birth_date')}</Text>
          <View style={question.inputWrapper}>
            <Date />
          </View>
        </View>
      </View>
    </View>
  )
}

export default BirthDate
