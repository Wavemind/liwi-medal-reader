/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { AdditionalSelect, DrugBooleanButton } from '@/Components'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'

const DiagnosisDrugs = ({ diagnosisKey }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Gutters,
    Containers: { drugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis[diagnosisKey],
  )

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param diagnosisId
   * @param drugId
   * @param value
   */
  const updateDrugs = (diagnosisId, drugId, value) => {
    const isInAgreed = Object.keys(
      diagnoses[diagnosisId].drugs.agreed,
    ).includes(drugId.toString())
    const isInRefused = diagnoses[diagnosisId].drugs.refused.includes(drugId)

    // From null to Agree
    if (value && !isInAgreed) {
      dispatch(
        AddAgreedDrugs.action({
          diagnosisKey,
          diagnosisId,
          drugId,
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        dispatch(
          RemoveRefusedDrugs.action({
            diagnosisKey,
            diagnosisId,
            drugId,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      dispatch(
        AddRefusedDrugs.action({
          diagnosisKey,
          diagnosisId,
          drugId,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        dispatch(
          RemoveAgreedDrugs.action({
            diagnosisKey,
            diagnosisId,
            drugId,
          }),
        )
      }
    }
  }

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

  return Object.values(diagnoses).map(diagnosis => (
    <View style={drugs.wrapper}>
      <View style={drugs.diagnosisHeaderWrapper}>
        <Text style={drugs.diagnosisHeader}>
          {translate(algorithm.nodes[diagnosis.id].label)}
        </Text>
        <Text style={drugs.diagnosisKey}>
          {t(`containers.medical_case.drugs.${diagnosisKey === 'agreed' ? 'proposed' : 'additional'}`)}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={drugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {diagnosis.drugs.proposed.map((drugId, i) => (
          <View
            style={drugs.drugWrapper(i === diagnosis.drugs.proposed.length - 1)}
          >
            <View style={drugs.drugTitleWrapper}>
              <Text style={drugs.drugTitle}>
                {translate(algorithm.nodes[drugId].label)}
              </Text>
              <DrugBooleanButton
                diagnosis={diagnosis}
                drugId={drugId}
                updateDrugs={updateDrugs}
              />
            </View>
            <Text style={Fonts.textSmall}>
              {translate(algorithm.nodes[drugId].description)}
            </Text>
          </View>
        ))}
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
    </View>
  ))
}

export default DiagnosisDrugs
