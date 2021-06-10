/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { AdditionalSelect } from '@/Components'
import RemoveAdditionalDiagnoses from '@/Store/MedicalCase/RemoveAdditionalDiagnoses'
import { useTheme } from '@/Theme'

const AdditionalDiagnoses = () => {
  // Theme and style elements deconstruction
  const { Fonts, Gutters } = useTheme()

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
