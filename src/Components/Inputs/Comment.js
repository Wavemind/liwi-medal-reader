/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { Text, View, TextInput } from 'react-native'
import Toggle from 'react-native-toggle-element'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { wp } from '@/Theme/Responsive'
import UpdateComment from '@/Store/MedicalCase/UpdateComment'

const Comment = () => {
  // Theme and style elements deconstruction
  const {
    Components: { toggleComplaintCategory, autocomplete, question },
    Colors,
    Gutters,
    Layout,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const comment = useSelector(state => state.medicalCase.item.comment)

  const [toggleValue, setToggleValue] = useState(comment !== '')
  const [text, setText] = useState(comment)

  /**
   * Save value in store
   */
  const onEndEditing = event => {
    const newValue = event.nativeEvent.text
    dispatch(UpdateComment.action({ value: newValue }))
  }

  /**
   * Clear value in state if clinician set Comment at false
   */
  useEffect(() => {
    if (!toggleValue && comment !== '') {
      setText('')
      dispatch(UpdateComment.action({ value: '' }))
    }
  }, [toggleValue])

  return (
    <View style={question.wrapper(false)}>
      <View style={question.container}>
        <View style={question.questionWrapper(false)}>
          <Text style={question.text(null)}>{t('medical_case.comment')}</Text>
          <View style={[question.inputWrapper, Layout.center]}>
            <Toggle
              value={toggleValue}
              onPress={setToggleValue}
              leftComponent={
                <Text style={toggleComplaintCategory.leftText(toggleValue)}>
                  {t('answers.yes')}
                </Text>
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
        </View>
        {toggleValue && (
          <View
            style={[autocomplete.inputWrapper(false), Gutters.regularTMargin]}
          >
            <TextInput
              multiline
              numberOfLines={10}
              style={autocomplete.textArea}
              keyboardType="default"
              onChangeText={setText}
              onEndEditing={onEndEditing}
              value={text}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default Comment
