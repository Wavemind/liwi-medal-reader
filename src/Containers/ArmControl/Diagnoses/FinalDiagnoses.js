/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  SectionHeader,
  AdditionalDiagnoses,
  CustomDiagnoses,
} from '@/Components'
import { useTheme } from '@/Theme'

const FinalDiagnoses = () => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()

  const { t } = useTranslation()

  return (
    <ScrollView style={Gutters.regularHPadding}>
      <SectionHeader
        label={t('containers.medical_case.diagnoses.additional_title')}
      />
      <AdditionalDiagnoses />
      <View style={[Gutters.largeTMargin, Gutters.largeBPadding]}>
        <SectionHeader
          label={t('containers.medical_case.diagnoses.custom_title')}
        />
        <CustomDiagnoses />
      </View>
    </ScrollView>
  )
}

export default FinalDiagnoses
