/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const PersonalInfoItem = ({ label, value }) => {
  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  return (
    <View style={patientPersonalInfo.textWrapper}>
      <Text style={patientPersonalInfo.label}>{label}</Text>
      <Text style={patientPersonalInfo.value}>{value}</Text>
    </View>
  )
}

export default PersonalInfoItem
