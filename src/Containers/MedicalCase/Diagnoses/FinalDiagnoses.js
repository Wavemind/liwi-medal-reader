/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

const FinalDiagnosesMedicalCaseContainer = () => {
  // Theme and style elements deconstruction
  const { Gutters } = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const versionName = useSelector(state => state.algorithm.item.version_name)

  useEffect(() => {
    async function resetDiagnoses() {
      await dispatch(SetDiagnoses.action({}))
    }
    resetDiagnoses()
  }, [])

  return (
    <KeyboardAwareScrollView
      style={Gutters.regularHPadding}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
    >
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
    </KeyboardAwareScrollView>
  )
}

export default FinalDiagnosesMedicalCaseContainer
