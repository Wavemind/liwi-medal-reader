/**
 * The external imports
 */
import React from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList, RegistrationHeader } from '@/Components'
import { RegistrationQuestions } from '@/Services/Steps'

const RegistrationMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const questions = RegistrationQuestions()

  return (
    <FlatList
      data={questions}
      ListHeaderComponent={<RegistrationHeader />}
      renderItem={({ item }) => <Question questionId={item} />}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      removeClippedSubviews={false}
      keyExtractor={item => item}
    />
  )
}

export default RegistrationMedicalCaseContainer
