/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const SectionHeader = ({ label }) => {
  // Theme and style elements deconstruction
  const {
    Components: { sectionHeader },
  } = useTheme()

  return (
    <View style={sectionHeader.wrapper}>
      <Text style={sectionHeader.label}>{label}</Text>
      <View style={sectionHeader.after} />
    </View>
  )
}

export default SectionHeader
