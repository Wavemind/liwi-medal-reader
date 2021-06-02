/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const IndexQuestionInfoContainer = props => {
  const { navigation } = props

  const { t } = useTranslation()

  // Theme and style elements deconstruction
  const {
    Containers: { questionInfo },
  } = useTheme()

  return (
    <View style={questionInfo.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={questionInfo.closeButton}
      >
        <Text style={questionInfo.closeButtonText}>{t('actions.continue')}</Text>
      </TouchableOpacity>
      <View style={questionInfo.contentWrapper}>
        <View>
          <Text>This is the question view</Text>
        </View>
      </View>
    </View>
  )
}

export default IndexQuestionInfoContainer
