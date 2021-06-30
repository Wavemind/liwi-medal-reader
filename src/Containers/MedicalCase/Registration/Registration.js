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
import { RegistrationQuestionsService } from '@/Services/Steps'

const RegistrationMedicalCaseContainer = () => {
  const { t } = useTranslation()

  const questions = RegistrationQuestionsService()

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
