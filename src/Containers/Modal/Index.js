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
import { Study, QuestionInfo, Emergency } from '@/Components'

const IndexModalContainer = ({ navigation, route }) => {
  const { t } = useTranslation()

  // Props deconstruction
  const {
    params: { type },
  } = route

  /**
   * Returns the correct modal content depending on the modal type
   * @returns {JSX.Element|null}
   */
  const defineContent = () => {
    switch (type) {
      case 'study':
        return <Study />
      case 'question':
        return <QuestionInfo {...route.params} />
      case 'emergency':
        return <Emergency />
      default:
        return null
    }
  }

  // Theme and style elements deconstruction
  const {
    Containers: { modalIndex },
  } = useTheme()

  return (
    <View style={modalIndex.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={modalIndex.closeButton}
      >
        <Text style={modalIndex.closeButtonText}>{t('actions.continue')}</Text>
      </TouchableOpacity>
      <View style={modalIndex.contentWrapper}>{defineContent()}</View>
    </View>
  )
}

export default IndexModalContainer
