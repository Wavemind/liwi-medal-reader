/**
 * The external imports
 */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { Custom } from '@/Components'
import ChangeCustomDiagnoses from '@/Store/MedicalCase/ChangeCustomDiagnoses'

const CustomDiagnoses = () => {
  const dispatch = useDispatch()

  const custom = useSelector(state => state.medicalCase.item.diagnosis.custom)

  /**
   * Handles the addition of a new custom diagnosis
   * @param value
   */
  const addCustomDiagnosis = value => {
    const tempCustomDiagnoses = { ...custom }

    const newDiagnosisId = uuid.v4()
    tempCustomDiagnoses[newDiagnosisId] = {
      id: newDiagnosisId,
      name: value,
      drugs: {},
    }

    dispatch(
      ChangeCustomDiagnoses.action({
        newCustomDiagnoses: tempCustomDiagnoses,
      }),
    )
  }

  /**
   * Handles the removal of a custom diagnosis
   * @param diagnosisId
   */
  const removeCustomDiagnosis = diagnosisId => {
    const tempCustomDiagnoses = { ...custom }
    delete tempCustomDiagnoses[diagnosisId]
    dispatch(
      ChangeCustomDiagnoses.action({
        newCustomDiagnoses: tempCustomDiagnoses,
      }),
    )
  }

  return (
    <Custom
      listObject={custom}
      handleAdd={addCustomDiagnosis}
      handleRemove={removeCustomDiagnosis}
    />
  )
}

export default CustomDiagnoses
