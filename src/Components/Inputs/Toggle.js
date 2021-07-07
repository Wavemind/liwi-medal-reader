/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import Toggle from 'react-native-toggle-element'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { wp } from '@/Theme/Responsive'
import { Icon } from '@/Components'
import { getYesAnswer, getNoAnswer } from '@/Utils/Answers'
import setAnswer from '@/Utils/SetAnswer'

const ToggleComplaintCategory = ({ questionId }) => {
  // Theme and style elements deconstruction
  const {
    Components: { toggleComplaintCategory },
    Colors,
    Layout,
  } = useTheme()

  const { t } = useTranslation()

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[question.id],
  )

  const yesAnswer = getYesAnswer(currentNode)
  const noAnswer = getNoAnswer(currentNode)

  const [toggleValue, setToggleValue] = useState(
    question.answer === yesAnswer.id,
  )

  /**
   * Update value in store when value changes
   */
  useEffect(() => {
    const answerId = toggleValue ? yesAnswer.id : noAnswer.id
    if (question.answer !== answerId) {
      setAnswer(question.id, answerId)
    }
  }, [toggleValue])

  return (
    <View style={toggleComplaintCategory.wrapper}>
      <Toggle
        value={toggleValue}
        onPress={newState => setToggleValue(newState)}
        leftComponent={
          <Text style={toggleComplaintCategory.leftText(toggleValue)}>
            {toggleValue && t('answers.yes')}
          </Text>
        }
        thumbActiveComponent={
          <View style={toggleComplaintCategory.iconStyle}>
            <Icon name="validate" />
          </View>
        }
        rightComponent={
          <Text style={toggleComplaintCategory.rightText}>
            {!toggleValue && t('answers.no')}
          </Text>
        }
        trackBarStyle={toggleComplaintCategory.trackBarStyle}
        trackBar={{
          activeBackgroundColor: Colors.primary,
          inActiveBackgroundColor: Colors.secondary,
          width: wp(19),
        }}
        thumbButton={{
          activeBackgroundColor: Colors.secondary,
          inActiveBackgroundColor: Colors.primary,
        }}
        thumbStyle={{
          borderWidth: wp(0.5),
          borderColor: Colors.primary,
          backgroundColor: Colors.secondary,
        }}
      />
    </View>
  )
}

export default ToggleComplaintCategory
