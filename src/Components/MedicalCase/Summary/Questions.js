/**
 * The external imports
 */
import React from 'react'
import { FlatList, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { QuestionItem } from '@/Components'
import { removeQuestions } from '@/Services/MedicalCase/RemoveQuestions'

const PersonalInfoPatientContainer = () => {
  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  const questions = removeQuestions()

  return (
    <View style={[patientPersonalInfo.wrapper]}>
      <FlatList
        data={Object.values(questions)}
        renderItem={({ item }) => (
          <QuestionItem questions={questions} questionId={item.id} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default PersonalInfoPatientContainer
