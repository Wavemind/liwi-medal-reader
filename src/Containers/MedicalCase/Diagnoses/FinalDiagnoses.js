/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  SectionHeader,
  ProposedDiagnoses,
  AdditionalDiagnoses,
  CustomDiagnoses,
} from '@/Components'
import { useTheme } from '@/Theme'
import SetDiagnoses from '@/Store/MedicalCase/Diagnoses/SetDiagnoses'

const FinalDiagnoses = () => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()
  const dispatch = useDispatch()

  const { t } = useTranslation()
  useEffect(() => dispatch(SetDiagnoses.action({})), [])
  const versionName = useSelector(state => state.algorithm.item.version_name)

  return (
    <ScrollView style={Gutters.regularHPadding}>
      <SectionHeader
        label={t('containers.medical_case.diagnoses.proposed_title', {
          version_name: versionName,
        })}
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
