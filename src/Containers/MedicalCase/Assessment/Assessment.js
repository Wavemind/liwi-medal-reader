/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { AssessmentQuestionsService } from '@/Services/Steps'

const AssessmentMedicalCaseContainer = () => {
  const { t } = useTranslation()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)
  const questions = useMemo(() => AssessmentQuestionsService(), [mcNodes])

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        ListEmptyComponent={
          <EmptyList text={t('containers.medical_case.no_questions')} />
        }
        removeClippedSubviews={false}
        keyExtractor={item => item}
      />
    </View>
  )
}

export default AssessmentMedicalCaseContainer
