/**
 * The external imports
 */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { AdditionalSelect } from '@/Components'
import RemoveAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAdditionalDiagnoses'

const AdditionalDiagnoses = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

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
    <AdditionalSelect
      listObject={additional}
      listItemLabel={t(
        'containers.medical_case.diagnoses.multiple_diagnostics',
      )}
      handleRemove={removeAdditionalDiagnosis}
    />
  )
}

export default AdditionalDiagnoses
