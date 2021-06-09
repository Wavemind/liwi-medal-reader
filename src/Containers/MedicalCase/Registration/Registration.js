/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  Question,
  Consent,
  BirthDate,
  SectionHeader,
  EmptyList,
} from '@/Components'
import { PatientString } from '@/Components/index'
import { useTheme } from '@/Theme'
import { RegistrationQuestions } from '@/Services/Steps'

const RegistrationMedicalCaseContainer = props => {
  const { t } = useTranslation()
  const { Gutters } = useTheme()

  const questions = RegistrationQuestions()

  /**
   * Returns the static questions for the medical case
   * @returns List of inputs to show
   */
  const Header = () => (
    <>
      <Consent />
      <View style={[Gutters.regularHMargin]}>
        <SectionHeader
          label={t('containers.medical_case.registration.questions')}
        />
      </View>

      <PatientString field="first_name" />
      <PatientString field="last_name" />
      <BirthDate />
    </>
  )

  return (
    <FlatList
      data={questions}
      ListHeaderComponent={<Header />}
      renderItem={({ item }) => <Question questionId={item} />}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      keyExtractor={item => item}
    />
  )
}

export default RegistrationMedicalCaseContainer