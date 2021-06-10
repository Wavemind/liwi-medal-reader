/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { CustomElement } from '@/Components'
import { useTheme } from '@/Theme'
import ChangeCustomDrugs from '@/Store/MedicalCase/Drugs/ChangeCustomDrugs'
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'

const CustomDrugs = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { drugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const customDiagnoses = useSelector(
    state => state.medicalCase.item.diagnosis.custom,
  )

  /**
   * Handles the addition of a new custom drug
   * @param diagnosisId
   * @param value
   */
  const addCustomDrug = (diagnosisId, value) => {
    const tempCustomDrugs = { ...customDiagnoses[diagnosisId].drugs }
    const newDrugId = uuid.v4()
    tempCustomDrugs[newDrugId] = {
      id: newDrugId,
      name: value,
      duration: '',
    }

    dispatch(
      ChangeCustomDrugs.action({
        diagnosisId,
        newCustomDrugs: tempCustomDrugs,
      }),
    )
  }

  /**
   * Handles the removal of a custom diagnosis
   * @param diagnosisId
   * @param drugId
   */
  const removeCustomDrug = (diagnosisId, drugId) => {
    const tempCustomDrugs = { ...customDiagnoses[diagnosisId].drugs }
    delete tempCustomDrugs[drugId]

    dispatch(
      ChangeCustomDrugs.action({
        diagnosisId,
        newCustomDrugs: tempCustomDrugs,
      }),
    )
  }

  /**
   * Updates the selected custom drug duration
   * @param diagnosisId
   * @param drugId
   * @param duration
   */
  const updateCustomDrugDuration = (diagnosisId, drugId, duration) => {
    const tempCustomDrug = {
      ...customDiagnoses[diagnosisId].drugs[drugId],
    }
    tempCustomDrug.duration = duration

    dispatch(
      ChangeCustomDrugDuration.action({
        diagnosisId,
        drugId,
        newCustomDrug: tempCustomDrug,
      }),
    )
  }

  return Object.values(customDiagnoses).map(diagnosis => (
    <View style={[drugs.wrapper, Gutters.regularBMargin]}>
      <View style={drugs.diagnosisHeaderWrapper}>
        <Text style={drugs.diagnosisHeader}>{diagnosis.name}</Text>
        <Text style={drugs.diagnosisType}>
          {t('containers.medical_case.drugs.custom')}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={drugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        <CustomElement
          listObject={diagnosis.drugs}
          handleAdd={addCustomDrug}
          handleRemove={removeCustomDrug}
          diagnosisId={diagnosis.id}
          withDuration
          onUpdateDuration={updateCustomDrugDuration}
        />
      </View>
    </View>
  ))
}

export default CustomDrugs
