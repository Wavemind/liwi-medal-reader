/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'
import { AssessmentArmControlQuestionsService } from '@/Services/Steps'

const AssessmentArmControlContainer = () => {
  const { t } = useTranslation()
  const [questions] = useState(AssessmentArmControlQuestionsService())

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

export default AssessmentArmControlContainer
