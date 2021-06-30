/**
 * The external imports
 */
import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { AdditionalSelect, CustomElement } from '@/Components'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import ArmAddCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmAddCustomDrugs'
import ArmRemoveCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmRemoveCustomDrugs'
import ArmChangeCustomDrugDuration from '@/Store/MedicalCase/ArmControl/ArmChangeCustomDrugDuration'

const DrugsArmControlContainer = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { drugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  const [diagnosisKey] = useState('additional')

  /**
   * Removes a single element from the additional diagnosis list
   * @param diagnosisId
   * @param drugId
   */
  const removeAdditionalDrug = (diagnosisId, drugId) => {
    dispatch(
      RemoveAdditionalDrugs.action({
        diagnosisKey,
        diagnosisId,
        drugId,
      }),
    )
  }

  /**
   * Updates the selected additional drug duration
   * @param diagnosisId
   * @param drugId
   * @param duration
   */
  const updateAdditionalDrugDuration = (diagnosisId, drugId, duration) => {
    dispatch(
      ChangeAdditionalDrugDuration.action({
        diagnosisKey,
        diagnosisId,
        drugId,
        duration,
      }),
    )
  }

  /**
   * Handles the addition of a new custom drug
   * @param diagnosisId
   * @param value
   */
  const addCustomDrug = (diagnosisId, value) => {
    const drugId = uuid.v4()
    dispatch(
      ArmAddCustomDrugs.action({
        diagnosisId,
        drugId,
        drugContent: {
          id: drugId,
          name: value,
          duration: '',
        },
      }),
    )
  }

  /**
   * Handles the removal of a custom diagnosis
   * @param diagnosisId
   * @param drugId
   */
  const removeCustomDrug = (diagnosisId, drugId) => {
    dispatch(
      ArmRemoveCustomDrugs.action({
        diagnosisId,
        drugId,
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
    dispatch(
      ArmChangeCustomDrugDuration.action({
        diagnosisId,
        drugId,
        duration,
      }),
    )
  }

  return (
    <ScrollView>
      <View style={Gutters.regularBMargin}>
        {Object.values(diagnoses).map(diagnosis => (
          <View key={`diagnosis-${diagnosis.id}`} style={drugs.wrapper}>
            <View style={drugs.diagnosisHeaderWrapper}>
              <Text style={drugs.diagnosisHeader}>
                {translate(algorithm.nodes[diagnosis.id].label)}
              </Text>
              <Text style={drugs.diagnosisKey}>
                {t('containers.medical_case.drugs.additional')}
              </Text>
            </View>
            <View style={Gutters.regularHPadding}>
              <Text style={drugs.drugsHeader}>
                {t('containers.medical_case.drugs.drugs')}
              </Text>
            </View>
            <View style={Gutters.regularHPadding}>
              <AdditionalSelect
                listObject={diagnosis.drugs.additional}
                listItemType="drugs"
                handleRemove={removeAdditionalDrug}
                diagnosisId={diagnosis.id}
                diagnosisKey={diagnosisKey}
                withDuration
                onUpdateDuration={updateAdditionalDrugDuration}
              />
            </View>
            <View style={Gutters.regularHPadding}>
              <CustomElement
                listObject={diagnosis.drugs.custom}
                handleAdd={addCustomDrug}
                handleRemove={removeCustomDrug}
                diagnosisId={diagnosis.id}
                withDuration
                onUpdateDuration={updateCustomDrugDuration}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default DrugsArmControlContainer
