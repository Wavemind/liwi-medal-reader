/**
 * The external imports
 */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { CustomElement } from '@/Components'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import RemoveCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveCustomDiagnoses'

const CustomDiagnoses = () => {
  const dispatch = useDispatch()

  const custom = useSelector(state => state.medicalCase.item.diagnosis.custom)

  /**
   * Handles the addition of a new custom diagnosis
   * @param value
   */
  const addCustomDiagnosis = value => {
    const diagnosisId = uuid.v4()

    dispatch(
      AddCustomDiagnoses.action({
        diagnosisId,
        diagnosisContent: {
          id: diagnosisId,
          name: value,
          drugs: {},
        },
      }),
    )
  }

  /**
   * Handles the removal of a custom diagnosis
   * @param diagnosisId
   */
  const removeCustomDiagnosis = diagnosisId => {
    dispatch(
      RemoveCustomDiagnoses.action({
        diagnosisId,
      }),
    )
  }

  return (
    <CustomElement
      listObject={custom}
      handleAdd={addCustomDiagnosis}
      handleRemove={removeCustomDiagnosis}
    />
  )
}

export default CustomDiagnoses
