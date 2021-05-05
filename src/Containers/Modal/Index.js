/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import Study from './Components/Study'
import QuestionInfo from './Components/QuestionInfo'

const IndexModalContainer = props => {
  // Props deconstruction
  const {
    navigation,
    route: {
      params: { type },
    },
  } = props

  /**
   * Returns the correct modal content depending on the modal type
   * @returns {JSX.Element|null}
   */
  const defineContent = () => {
    switch (type) {
      case 'study':
        return <Study />
      case 'question':
        return <QuestionInfo />
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
      <View style={modalIndex.closeButtonWrapper}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={modalIndex.closeButton}
        >
          <Text style={modalIndex.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      {defineContent()}
    </View>
  )
}

export default IndexModalContainer
