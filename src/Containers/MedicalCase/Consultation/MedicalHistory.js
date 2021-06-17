/**
 * The external imports
 */
import React from 'react'
import { SectionList, View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Question } from '@/Components'
import { translate } from '@/Translations/algorithm'

const MedicalHistoryMedicalCaseContainer = props => {
  const { Gutters } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)
  const systems = useSelector(
    state => state.algorithm.item.config.full_order.medical_history_step,
  )

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
