/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { SectionList, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Question } from '@/Components'
import { translate } from '@/Translations/algorithm'
import MedicalHistory from '@/Store/QuestionsPerSystem/MedicalHistory'

const MedicalHistoryMedicalCaseContainer = props => {
  const { Gutters } = useTheme()
  const dispatch = useDispatch()

  const algorithm = useSelector(state => state.algorithm.item)
  const systems = useSelector(
    state => state.questionsPerSystem.item.medicalHistory,
  )
  console.log(systems)
  // Update questions list only if question array change
  useEffect(() => {
    dispatch(MedicalHistory.action())
  }, [])

  return (
    <SectionList
      sections={systems}
      keyExtractor={item => item}
      removeClippedSubviews={false}
      renderItem={({ item }) => <Question questionId={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={Gutters.regularHMargin}>
          <SectionHeader
            label={translate(algorithm.config.systems_translations[title])}
          />
        </View>
      )}
    />
  )
}

export default MedicalHistoryMedicalCaseContainer
