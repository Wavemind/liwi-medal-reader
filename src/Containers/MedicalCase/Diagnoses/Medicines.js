/**
 * The external imports
 */
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * The internal imports
 */
import { CalculatedDrugs, AdditionalDrugs, CustomDrugs } from '@/Components'
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

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={200}>
      <CalculatedDrugs calculatedDrugs={drugs.calculated} />
      <AdditionalDrugs additionalDrugs={drugs.additional} />
      <CustomDrugs customDrugs={drugs.custom} />
    </KeyboardAwareScrollView>
  )
}

export default MedicinesMedicalCaseContainer
