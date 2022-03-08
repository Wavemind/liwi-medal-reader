/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { ComplaintCategoryQuestionsService } from '@/Services/Steps'

const ComplaintCategoryMedicalCaseContainer = () => {
  const { t } = useTranslation()

  const questions = useMemo(() => ComplaintCategoryQuestionsService(), [])

  return (
    <FlatList
      data={questions}
      renderItem={({ item }) => <Question questionId={item} />}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      removeClippedSubviews={false}
      keyExtractor={item => item}
    />
  )
}

export default ComplaintCategoryMedicalCaseContainer
