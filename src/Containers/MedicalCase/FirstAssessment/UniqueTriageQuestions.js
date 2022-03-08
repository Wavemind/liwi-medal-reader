/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { UniqueTriageQuestionsService } from '@/Services/Steps'

const UniqueTriageQuestionsMedicalCaseContainer = () => {
  const { t } = useTranslation()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)
  const questions = useMemo(() => UniqueTriageQuestionsService(), [mcNodes])

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

export default UniqueTriageQuestionsMedicalCaseContainer
