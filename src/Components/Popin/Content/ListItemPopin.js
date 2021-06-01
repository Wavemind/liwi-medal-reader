/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import SquareButton from '../../Buttons/SquareButton'
import { useTheme } from '@/Theme'

const EmergencyPopin = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { popin },
  } = useTheme()

  const handleOnPress = () => {
    console.log('button pressed')
  }

  return (
    <View>
      <Text style={popin.header}>Emergency Assistance</Text>
      <Text style={popin.body}>
        The patient is presenting a severe/emergency symptom or sign. Click on the emergency button if the child needs emergency care now.
      </Text>

      <View style={popin.buttonWrapper}>
        <SquareButton
          label="GO TO EMERGENCY"
          filled
          onPress={handleOnPress}
          bgColor={Colors.red}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default EmergencyPopin
