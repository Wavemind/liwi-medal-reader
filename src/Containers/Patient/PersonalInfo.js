/**
 * The external imports
 */
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader } from '@/Components'

const PersonalInfoPatientContainer = props => {
  const { t } = useTranslation()

  const {
    Containers: { patientPersonalInfo },
  } = useTheme()

  return (
    <ScrollView contentContainerStyle={patientPersonalInfo.wrapper}>
      <SectionHeader
        label={t('containers.patient.personal_info.patient_info')}
      />
      <View style={patientPersonalInfo.textWrapper}>
        <Text style={patientPersonalInfo.label}>First name</Text>
        <Text style={patientPersonalInfo.value}>Quentin</Text>
      </View>
      <View style={patientPersonalInfo.textWrapper}>
        <Text style={patientPersonalInfo.label}>First name</Text>
        <Text style={patientPersonalInfo.value}>Quentin</Text>
      </View>
      <View style={patientPersonalInfo.textWrapper}>
        <Text style={patientPersonalInfo.label}>First name</Text>
        <Text style={patientPersonalInfo.value}>Quentin</Text>
      </View>
    </ScrollView>
  )
}

export default PersonalInfoPatientContainer
