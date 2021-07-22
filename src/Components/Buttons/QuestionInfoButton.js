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
import { useTheme } from '@/Theme'

const QuestionInfoButton = ({ nodeId, color }) => {
  const { Colors } = useTheme()

  const iconColor = color || Colors.info

  return (
    <TouchableOpacity onPress={() => navigate('QuestionInfo', { nodeId })}>
      <Icon name="simple-info" color={iconColor} />
    </TouchableOpacity>
  )
}

export default QuestionInfoButton
