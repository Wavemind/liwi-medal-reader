/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity } from 'react-native'

/**
 * The internal imports
 */
import { navigate } from '@/Navigators/Root'
import { Icon } from '@/Components'
import { Colors } from '@/Theme/Variables'

const QuestionInfoButton = ({ nodeId, color = Colors.primary }) => {
  return (
    <TouchableOpacity onPress={() => navigate('QuestionInfo', { nodeId })}>
      <Icon name="simple-info" color={color} />
    </TouchableOpacity>
  )
}

export default QuestionInfoButton
