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
import RemoveAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAdditionalDiagnoses'

const AdditionalDiagnoses = () => {
  const dispatch = useDispatch()

  const additional = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  /**
   * Removes a single element from the additional diagnosis list
   * @param diagnosisId
   */
  const removeAdditionalDiagnosis = diagnosisId => {
    dispatch(
      RemoveAdditionalDiagnoses.action({
        diagnosisId,
      }),
    )
  }

  return (
    <View>
      <View>
        <AdditionalSelect
          listObject={additional}
          listItemType="diagnoses"
          handleRemove={removeAdditionalDiagnosis}
        />
      </View>
    </View>
  )
}

export default AdditionalDiagnoses
