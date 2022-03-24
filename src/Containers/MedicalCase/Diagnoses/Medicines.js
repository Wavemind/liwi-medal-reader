/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { ScrollView, KeyboardAvoidingView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { ProposedDrugs, AdditionalDrugs, CustomDrugs } from '@/Components'
import { reworkAndOrderDrugs } from '@/Utils/Drug'
import SetDrugs from '@/Store/MedicalCase/Drugs/SetDrugs'

const MedicinesMedicalCaseContainer = () => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  useEffect(() => {
    dispatch(SetDrugs.action())
  }, [isFocused])

  const drugs = useMemo(reworkAndOrderDrugs, [diagnoses])

  // TODO: CHANGE WITH KeyboardAvoidingScrollView IN SUMMARY
  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={200}>
      <ScrollView>
        <ProposedDrugs proposedDrugs={drugs.agreed} />
        <AdditionalDrugs additionalDrugs={drugs.additional} />
        <CustomDrugs customDrugs={drugs.custom} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default MedicinesMedicalCaseContainer
