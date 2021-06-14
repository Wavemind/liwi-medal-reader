/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { SectionList, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Question } from '@/Components'
import { translate } from '@/Translations/algorithm'
import { MedicalHistoryQuestions } from '@/Services/Steps'

const MedicalHistoryMedicalCaseContainer = props => {
  const { Gutters } = useTheme()
  const isFocused = useIsFocused()

  const algorithm = useSelector(state => state.algorithm.item)
  const medicalCase = useSelector(state => state.medicalCase.item)

  const [systems, setSystems] = useState(MedicalHistoryQuestions())

  // Update questions list only if question array change
  useEffect(() => {
    const medicalHistoryQuestions = MedicalHistoryQuestions()

    if (!isEqual(medicalHistoryQuestions, systems)) {
      setSystems(medicalHistoryQuestions)
    }
  }, [isFocused, medicalCase])

  return (
    <SectionList
      sections={systems}
      keyExtractor={item => item}
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
