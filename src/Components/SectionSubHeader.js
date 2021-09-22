/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const SectionSubHeader = ({ label }) => {
  // Theme and style elements deconstruction
  const {
    Components: { sectionSubHeader },
  } = useTheme()

  return (
    <View style={sectionSubHeader.wrapper}>
      <Text style={sectionSubHeader.label}>{label}</Text>
    </View>
  )
}

export default SectionSubHeader
