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
import { PhysicalExamQuestions } from '@/Services/Steps'

const PhysicalExamMedicalCaseContainer = props => {
  const { Gutters } = useTheme()
  const isFocused = useIsFocused()

  const algorithm = useSelector(state => state.algorithm.item)
  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  const [systems, setSystems] = useState(PhysicalExamQuestions())

  // Update questions list only if question array change
  useEffect(() => {
    const physicalExamQuestions = PhysicalExamQuestions()

    if (!isEqual(physicalExamQuestions, systems)) {
      setSystems(physicalExamQuestions)
    }
  }, [isFocused, mcNodes])
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

export default PhysicalExamMedicalCaseContainer
