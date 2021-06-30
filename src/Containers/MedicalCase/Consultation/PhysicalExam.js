/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Question, Comment } from '@/Components'
import { translate } from '@/Translations/algorithm'
import PhysicalExam from '@/Store/QuestionsPerSystem/PhysicalExam'

const PhysicalExamMedicalCaseContainer = props => {
  const { Gutters } = useTheme()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const systemsTranslations = useSelector(
    state => state.algorithm.item.config.systems_translations,
  )

  const systems = useSelector(
    state => state.questionsPerSystem.item.physicalExam,
  )

  // Update questions list only if question array change
  useEffect(() => {
    if (isFocused) {
      dispatch(PhysicalExam.action())
    }
  }, [isFocused])

  return (
    <ScrollView>
      {systems.map(system => {
        if (system.data.length > 0) {
          return (
            <View key={system.title}>
              <View style={Gutters.regularHMargin}>
                <SectionHeader
                  label={translate(systemsTranslations[system.title])}
                />
              </View>
              {system.data.map(item => (
                <Question key={item} questionId={item} />
              ))}
            </View>
          )
        }
      })}
      <Comment />
    </ScrollView>
  )
}

export default PhysicalExamMedicalCaseContainer
