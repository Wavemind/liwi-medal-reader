/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const RoundedButton = props => {
  const { content, disabled, icon } = props

  const { Components, Colors, Gutters } = useTheme()

  const handlePress = () => {
    console.log('button pressed')
  }

  return (
    <View style={Components.roundedButton.wrapper}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={Components.roundedButton.base(disabled)}
        disabled={disabled}
      >
        <View style={Components.roundedButton.content}>
          {icon && (
            <View style={Gutters.regularRMargin}>
              <Icon name={icon} size={18} color={Colors.white} />
            </View>
          )}
          <Text style={Components.roundedButton.baseText}>{content}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RoundedButton
