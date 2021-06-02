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

const Lock = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  /**
   * TODO
   */
  const handleForceUnlock = () => {
    console.log('force unlock')
  }

  /**
   * TODO
   */
  const handleSummary = () => {
    console.log('summary')
  }

  return (
    <View>
      <Text style={modal.header}>Consultation not available</Text>
      <Text style={modal.body}>
        Case is locked by Jean Neige
      </Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label="FORCE UNLOCK"
          filled
          onPress={handleForceUnlock}
          bgColor={Colors.red}
          fullWidth={false}
        />
        <SquareButton
          label="SUMMARY"
          filled
          onPress={handleSummary}
          bgColor={Colors.grey}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Lock
