/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Question } from '@/Components'
import { translate } from '@/Translations/algorithm'

const System = ({ systemName, step }) => {
  const { Gutters } = useTheme()
  const systemsTranslations = useSelector(
    state => state.algorithm.item.config.systems_translations,
  )

  const systemData = useSelector(
    state => state.questionsPerSystem.item[step][systemName],
  )

  return (
    systemData?.length > 0 && (
      <View key={systemName}>
        <View style={Gutters.regularHMargin}>
          <SectionHeader label={translate(systemsTranslations[systemName])} />
        </View>
        {systemData.map(item => (
          <Question key={item} questionId={item} />
        ))}
      </View>
    )
  )
}
export default System
