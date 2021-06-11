/**
 * The external imports
 */
import React from 'react'
import { FlatList, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'

const UniqueTriageQuestionsMedicalCaseContainer = props => {
  const { t } = useTranslation()

  const questions = useSelector(
    state => state.algorithm.item.config.full_order.first_look_assessment_step,
  )

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default UniqueTriageQuestionsMedicalCaseContainer
