/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import AlgorithmInfo from './Components/AlgorithmInfo'
import QuestionInfo from './Components/QuestionInfo'

const IndexModalContainer = props => {
  // Props deconstruction
  const { navigation, route } = props

  const { type, algorithm } = route.params

  const defineContent = () => {
    switch (type) {
      case 'algorithm':
        return <AlgorithmInfo algorithm={algorithm} />
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={modalIndex.closeButton} >
          <Text style={modalIndex.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <View>
        {defineContent()}
      </View>
    </View>
  )
}

export default IndexModalContainer
