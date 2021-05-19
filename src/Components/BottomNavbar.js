/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { FontSize } from '@/Theme/Variables'
import { navigate } from '@/Navigators/Root'

const BottomNavbar = props => {
  // Props deconstruction
  const { content, disabled } = props

  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
  } = useTheme()

  // Local state definition
  const [isSelected, setSelection] = useState(false)

  return (
    <View style={bottomNavbar.container}>
      <TouchableOpacity
        onPress={() => setSelection(!isSelected)}
        style={bottomNavbar.emergencyContainer}
        disabled={disabled}
      >
        <Icon
          name={'emergency'}
          style={{
            fontSize: FontSize.huge,
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('MyHome')}>
        <Text> Lol </Text>
      </TouchableOpacity>
    </View>
  )
}

export default BottomNavbar
