/**
 * The external imports
 */
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import {
  SectionHeader,
  SectionSubHeader,
  Question,
  SummaryQuestionItem,
} from '@/Components'
import { translate } from '@/Translations/algorithm'

const System = ({ systemName, step, readOnly = false }) => {
  const { Gutters } = useTheme()
  const systemsTranslations = useSelector(
    state => state.algorithm.item.config.systems_translations,
  )

  const systemData = useSelector(
    state => state.questionsPerSystem.item[step][systemName],
  )

  const systemLabel = useCallback(
    systemKey => translate(systemsTranslations[systemKey]),
    [],
  )

  return (
    systemData?.length > 0 && (
      <View key={systemName}>
        <View style={readOnly ? '' : Gutters.regularHMargin}>
          {readOnly ? (
            <SectionSubHeader label={systemLabel(systemName)} />
          ) : (
            <SectionHeader label={systemLabel(systemName)} />
          )}
        </View>
        {systemData.map(item =>
          readOnly ? (
            <SummaryQuestionItem key={item} nodeId={item} />
          ) : (
            <Question key={item} questionId={item} />
          ),
        )}
      </View>
    )
  )
}
export default System
