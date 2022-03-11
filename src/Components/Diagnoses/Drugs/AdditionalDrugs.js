/**
 * The external imports
 */
import React, { useEffect, useState, useMemo } from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import {
  Icon,
  DrugsAutocomplete,
  QuestionInfoButton,
  AdditionalSelect,
} from '@/Components'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import {
  reworkAndOrderDrugs,
  drugIsAgreed,
  displayDrugDescription,
} from '@/Utils/Drug'
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

  const additionalDrugs = useMemo(
    () => reworkAndOrderDrugs('additional'),
    [diagnoses],
  )

  console.log(additionalDrugs)

  const [tempDrugs, setTempDrugs] = useState([])

  /**
   * Sorts the diagnoses by level_of_urgency
   * @returns {*}
   */
  // const sortDiagnosesByUrgency = () =>
  //   orderBy(
  //     Object.values(diagnoses),
  //     finalDiagnosis => nodes[finalDiagnosis.id].level_of_urgency,
  //     ['desc', 'asc'],
  //   )

  // const [sortedDiagnoses, setSortedDiagnoses] = useState(
  //   sortDiagnosesByUrgency(),
  // )

  // useEffect(() => {
  //   const newDiagnoses = sortDiagnosesByUrgency()
  //   setSortedDiagnoses(newDiagnoses)
  // }, [isFocused, diagnoses])

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
    setTempDrugs([...tempDrugs, value])
  }

  const onRemovePress = drugId => {
    const newDrugs = [...tempDrugs]
    const indexToRemove = newDrugs.findIndex(drug => drug === drugId)
    if (indexToRemove > -1) {
      newDrugs.splice(indexToRemove, 1)
    }
    setTempDrugs(newDrugs)
  }

  const onUpdateDuration = (itemId, duration) => {
    console.log(itemId, duration)
  }

  const removeDiagnosisPress = () => {
    console.log('this is all fucked')
  }

  return (
    <View style={drugs.wrapper}>
      <View style={drugs.headerWrapper}>
        <Text style={drugs.header}>Additional medicines</Text>
      </View>
      {tempDrugs.map((additionalDrugId, i) => (
        <View
          style={{
            ...Gutters.regularHPadding,
            ...Gutters.regularVPadding,
            borderBottomColor: Colors.grey,
            borderBottomWidth: 1,
          }}
        >
          <View
            style={{
              ...Layout.rowHCenter,
              ...Layout.justifyContentBetween,
              ...Gutters.regularVMargin,
            }}
          >
            <Text style={additionalSelect.itemLabel}>
              {translate(nodes[additionalDrugId].label)}
            </Text>
            <QuestionInfoButton nodeId={additionalDrugId} />
            <View style={additionalSelect.durationWrapper}>
              <TextInput
                style={additionalSelect.durationInput}
                onChangeText={duration =>
                  onUpdateDuration(additionalDrugId, duration)
                }
                value={''}
                textAlign="center"
                keyboardType="default"
              />
            </View>
            <TouchableOpacity onPress={() => onRemovePress(additionalDrugId)}>
              <Icon style={{}} name="delete" size={FontSize.large} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={additionalSelect.addAdditionalButton}
            onPress={() =>
              navigate('SearchRelatedDiagnoses', { drugId: additionalDrugId })
            }
          >
            <Text style={additionalSelect.addAdditionalButtonText}>
              Selected related diagnoses
            </Text>
            <View style={additionalSelect.addAdditionalButtonCountWrapper}>
              <Text style={additionalSelect.addAdditionalButtonCountText}>
                0
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
