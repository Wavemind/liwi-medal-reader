/**
 * The external imports
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import {
  Icon,
  DrugsAutocomplete,
  QuestionInfoButton,
  AdditionalDrug,
} from '@/Components'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import { reworkAndOrderDrugs } from '@/Utils/Drug'
import { navigate } from '@/Navigators/Root'

const AdditionalDrugs = () => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Layout,
    Colors,
    Containers: { formulations, drugs, finalDiagnoses },
    Components: { additionalSelect },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  const [tempDrugs, setTempDrugs] = useState([])

  const additionalDrugs = useMemo(
    () => reworkAndOrderDrugs('additional'),
    [diagnoses],
  )

  useEffect(() => {
    const newTempDrugs = [...tempDrugs].filter(drug =>
      additionalDrugs.map(d => d.id).includes(drug.id),
    )
    setTempDrugs(newTempDrugs)
  }, [diagnoses])

  /**
   * Removes a single element from the additional diagnosis list
   * @param diagnosisId
   * @param drugId
   */
  // const removeAdditionalDrug = (diagnosisId, drugId) => {
  //   dispatch(
  //     RemoveAdditionalDrugs.action({
  //       diagnosisKey,
  //       diagnosisId,
  //       drugId,
  //     }),
  //   )
  // }

  /**
   * Updates the selected additional drug duration
   * @param diagnosisId
   * @param drugId
   * @param duration
   */
  // const updateAdditionalDrugDuration = (diagnosisId, drugId, duration) => {
  //   dispatch(
  //     ChangeAdditionalDrugDuration.action({
  //       diagnosisKey,
  //       diagnosisId,
  //       drugId,
  //       duration,
  //     }),
  //   )
  // }

  /**
   * Updates the formulations in the local state
   * @param drugId
   * @param value
   */
  const updateAdditionalDrugs = value => {
    setTempDrugs([
      ...tempDrugs,
      { id: value, relatedDiagnoses: [], duration: '' },
    ])
  }

  const onRemovePress = drugId => {
    const newDrugs = [...tempDrugs]
    const indexToRemove = newDrugs.findIndex(drug => drug.id === drugId)
    if (indexToRemove > -1) {
      newDrugs.splice(indexToRemove, 1)
    }
    setTempDrugs(newDrugs)
  }

  const onUpdateDuration = (itemId, duration) => {
    console.log(itemId, duration)
  }

  return (
    <View style={drugs.wrapper}>
      <View style={drugs.headerWrapper}>
        <Text style={drugs.header}>Additional medicines</Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {additionalDrugs.map((drug, i) => (
          <AdditionalDrug
            drug={drug}
            isLast={i === Object.keys(additionalDrugs).length - 1}
          />
        ))}
      </View>
      {tempDrugs.map((additionalDrug, i) => (
        <View style={additionalSelect.addAdditionalWrapper}>
          <View style={drugs.drugTitleWrapper}>
            <Text style={drugs.drugTitle}>
              {translate(nodes[additionalDrug.id].label)}
            </Text>
            <QuestionInfoButton nodeId={additionalDrug.id} />
            <View style={additionalSelect.durationWrapper}>
              <TextInput
                style={additionalSelect.durationInput}
                onChangeText={duration =>
                  onUpdateDuration(additionalDrug.id, duration)
                }
                value=""
                textAlign="center"
                keyboardType="default"
                editable={false}
              />
            </View>
            <TouchableOpacity onPress={() => onRemovePress(additionalDrug.id)}>
              <Icon style={{}} name="delete" size={FontSize.large} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={additionalSelect.addAdditionalButton}
            onPress={() =>
              navigate('SearchRelatedDiagnoses', { drugId: additionalDrug.id })
            }
          >
            <Text style={additionalSelect.addAdditionalButtonText}>
              {t('containers.medical_case.diagnoses.related_placeholder')}
            </Text>
            <View style={additionalSelect.addAdditionalButtonCountWrapper}>
              <Text style={additionalSelect.addAdditionalButtonCountText}>
                {additionalDrug.relatedDiagnoses.length}
              </Text>
            </View>
            <Icon
              style={Gutters.regularLMargin}
              name="right-arrow"
              size={FontSize.large}
            />
          </TouchableOpacity>
        </View>
      ))}
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        <DrugsAutocomplete updateAdditionalDrugs={updateAdditionalDrugs} />
      </View>
    </View>
  )
}

export default AdditionalDrugs
