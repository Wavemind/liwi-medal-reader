/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import Toggle from 'react-native-toggle-element'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { wp } from '@/Theme/Responsive'
import { Icon } from '@/Components'
import { getYesAnswer, getNoAnswer } from '@/Utils/Answers'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

const ToggleComplaintCategory = ({ questionId }) => {
  // Theme and style elements deconstruction
  const {
    Components: { toggleComplaintCategory },
    Colors,
    Layout,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[question.id],
  )

  const yesAnswer = getYesAnswer(currentNode)
  const noAnswer = getNoAnswer(currentNode)

  // TODO: Need to set by default answer to false
  const [toggleValue, setToggleValue] = useState(
    question.answer === yesAnswer.id,
  )

  /**
   * Update value in store when value changes
   */
  useEffect(() => {
    if (question.answer !== toggleValue) {
      const answerId = toggleValue ? yesAnswer.id : noAnswer.id
      dispatch(SetAnswer.action({ nodeId: question.id, value: answerId }))
    }
  }, [toggleValue])

  return (
    <View style={Layout.center}>
      <Toggle
        value={toggleValue}
        onPress={newState => setToggleValue(newState)}
        leftComponent={
          <Text style={toggleComplaintCategory.leftText(toggleValue)}>
            {t('answers.yes')}
          </Text>
        }
        rightComponent={
          toggleValue ? (
            <Icon name="validate" color={Colors.primary} />
          ) : (
            <Text style={toggleComplaintCategory.rightText}>
              {t('answers.no')}
            </Text>
          )
        }
        trackBarStyle={toggleComplaintCategory.trackBarStyle}
        trackBar={{
          activeBackgroundColor: Colors.primary,
          inActiveBackgroundColor: Colors.secondary,
          borderWidth: 1,
          width: wp(19),
        }}
        thumbButton={{
          activeBackgroundColor: Colors.secondary,
          inActiveBackgroundColor: Colors.primary,
        }}
      />
    </View>
  )
}

export default ToggleComplaintCategory
