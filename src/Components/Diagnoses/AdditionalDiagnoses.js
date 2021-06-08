/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { AdditionalSelect } from '@/Components'
import ChangeAdditionalDiagnoses from '@/Store/MedicalCase/ChangeAdditionalDiagnoses'

const AdditionalDiagnoses = () => {
  const dispatch = useDispatch()

  const additional = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  /**
   * Removes a single element from the additional diagnosis list
   * @param additionalDiagnosisId
   */
  const removeAdditionalDiagnosis = additionalDiagnosisId => {
    const tempAdditionalDiagnoses = { ...additional }

    const index = Object.keys(tempAdditionalDiagnoses).indexOf(
      additionalDiagnosisId.toString(),
    )
    if (index > -1) {
      delete tempAdditionalDiagnoses[additionalDiagnosisId.toString()]
    }

    dispatch(
      ChangeAdditionalDiagnoses.action({
        newAdditionalDiagnoses: tempAdditionalDiagnoses,
      }),
    )
  }

  return (
    <View>
      <AdditionalSelect
        list={Object.values(additional)}
        listItemType="diagnoses"
        navigateTo="Diagnoses"
        handleRemove={removeAdditionalDiagnosis}
      />
    </View>
  )
}

export default AdditionalDiagnoses
