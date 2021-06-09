/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'

const AssessmentMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const questions = useSelector(
    state => state.algorithm.item.config.full_order.test_step,
  )

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        ListEmptyComponent={
          <EmptyList text={t('containers.medical_case.no_questions')} />
        }
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default AssessmentMedicalCaseContainer
