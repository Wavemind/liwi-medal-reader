/**
 * The external imports
 */
import React from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  Question,
  EmptyList,
  RegistrationHeader,
  PatientString,
  BirthDate,
} from '@/Components'
import { RegistrationQuestions } from '@/Services/Steps'

const RegistrationMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const questions = RegistrationQuestions()

  /**
   * Renders the correct question type
   * @param item
   * @returns {JSX.Element}
   */
  const renderQuestion = item => {
    if (typeof item === 'number') {
      return <Question questionId={item} />
    } else {
      switch (item) {
        case 'first_name':
          return <PatientString field="first_name" />
        case 'last_name':
          return <PatientString field="first_name" />
        default:
          return <BirthDate />
      }
    }
  }

  return (
    <FlatList
      data={questions}
      ListHeaderComponent={<RegistrationHeader />}
      renderItem={({ item }) => renderQuestion(item)}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      removeClippedSubviews={false}
      keyExtractor={item => item}
    />
  )
}

export default RegistrationMedicalCaseContainer
