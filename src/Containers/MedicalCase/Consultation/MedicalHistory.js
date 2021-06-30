/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { SectionList, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Question } from '@/Components'
import { translate } from '@/Translations/algorithm'
import MedicalHistory from '@/Store/QuestionsPerSystem/MedicalHistory'

const MedicalHistoryMedicalCaseContainer = props => {
  const { Gutters } = useTheme()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const systemsTranslations = useSelector(
    state => state.algorithm.item.config.systems_translations,
  )

  const systems = useSelector(
    state => state.questionsPerSystem.item.medicalHistory,
  )
  // Update questions list only if question array change
  useEffect(() => {
    if (isFocused) {
      dispatch(MedicalHistory.action())
    }
  }, [isFocused])

  return (
    <SectionList
      sections={systems}
      keyExtractor={item => item}
      removeClippedSubviews={false}
      renderItem={({ item }) => <Question questionId={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={Gutters.regularHMargin}>
          <SectionHeader label={translate(systemsTranslations[title])} />
        </View>
      )}
    />
  )
}

export default MedicalHistoryMedicalCaseContainer
