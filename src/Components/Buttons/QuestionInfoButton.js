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

const QuestionInfoButton = ({ nodeId, color, finalDiagnosticId = null }) => {
  const { Colors } = useTheme()

  const iconColor = color || Colors.info

  return (
    <TouchableOpacity
      onPress={() => navigate('QuestionInfo', { nodeId, finalDiagnosticId })}
    >
      <Icon name="simple-info" color={iconColor} />
    </TouchableOpacity>
  )
}

export default QuestionInfoButton
