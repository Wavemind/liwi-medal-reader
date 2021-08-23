/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import orderBy from 'lodash/orderBy'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { AdditionalSelect, DrugBooleanButton } from '@/Components'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'

const DiagnosisDrugs = ({ diagnosisKey }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { finalDiagnoses, drugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const algorithm = useSelector(state => state.algorithm.item)
  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis[diagnosisKey],
  )

  /**
   * Sorts the diagnoses by level_of_urgency
   * @returns {*}
   */
  const sortDiagnosesByUrgency = () => {
    return orderBy(
      Object.values(diagnoses),
      finalDiagnosis => algorithm.nodes[finalDiagnosis.id].level_of_urgency,
      ['desc', 'asc'],
    )
  }

  const [sortedDiagnoses, setSortedDiagnoses] = useState(
    sortDiagnosesByUrgency(),
  )

  useEffect(() => {
    const newDiagnoses = sortDiagnosesByUrgency()
    setSortedDiagnoses(newDiagnoses)
  }, [isFocused, diagnoses])

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

  return sortedDiagnoses.map(diagnosis => (
    <View key={`diagnosis-${diagnosis.id}`} style={drugs.wrapper}>
      <View style={drugs.diagnosisHeaderWrapper}>
        <Text style={drugs.diagnosisHeader}>
          {translate(algorithm.nodes[diagnosis.id].label)}
        </Text>
        <Text style={drugs.diagnosisKey}>
          {t(
            `containers.medical_case.drugs.${
              diagnosisKey === 'agreed' ? 'proposed' : 'additional'
            }`,
          )}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={drugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {diagnosis.drugs.proposed.length === 0 ? (
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.drugs.no_proposed')}
          </Text>
        ) : (
          diagnosis.drugs.proposed.map((drugId, i) => (
            <View
              key={`diagnosis_drugs-${drugId}`}
              style={drugs.drugWrapper(
                i === diagnosis.drugs.proposed.length - 1,
              )}
            >
              <View style={drugs.drugTitleWrapper}>
                <Text style={drugs.drugTitle}>
                  {translate(algorithm.nodes[drugId].label)}
                </Text>
                <DrugBooleanButton
                  diagnosis={diagnosis}
                  drugId={drugId}
                  diagnosisKey={diagnosisKey}
                />
              </View>
              <Text style={drugs.drugDescription}>
                {translate(algorithm.nodes[drugId].description)}
              </Text>
            </View>
          ))
        )}
      </View>
      <View style={Gutters.regularHPadding}>
        <AdditionalSelect
          listObject={diagnosis.drugs.additional}
          listItemLabel={t('containers.medical_case.diagnoses.multiple_drugs')}
          handleRemove={removeAdditionalDrug}
          diagnosisId={diagnosis.id}
          diagnosisKey={diagnosisKey}
          withDuration
          onUpdateDuration={updateAdditionalDrugDuration}
        />
      </View>
    </View>
  ))
}

export default DiagnosisDrugs
