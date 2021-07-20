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
  const { Colors, Layout } = useTheme()

  const iconColor = color || Colors.info

  return (
    <TouchableOpacity
      style={Layout.fill}
      onPress={() => navigate('QuestionInfo', { nodeId })}
    >
      <Icon name="simple-info" color={iconColor} />
    </TouchableOpacity>
  )
}

export default QuestionInfoButton
