/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  SectionHeader,
  ProposedDiagnoses,
  AdditionalDiagnoses,
  CustomDiagnoses, AdditionalSelect,
} from '@/Components'
import { useTheme } from '@/Theme'

const FinalDiagnoses = () => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()

  const { t } = useTranslation()

  const versionName = useSelector(state => state.algorithm.item.version_name)

  return (
    <ScrollView style={Gutters.regularHPadding}>
      <SectionHeader
        label={t('containers.medical_case.diagnoses.proposed_title', { version_name: versionName })}
      />
      <ProposedDiagnoses />
      <View style={Gutters.largeTMargin}>
        <SectionHeader
          label={t('containers.medical_case.diagnoses.additional_title')}
        />
        <AdditionalDiagnoses />
      </View>
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
