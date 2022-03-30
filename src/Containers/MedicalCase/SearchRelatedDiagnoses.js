/**
 * The external imports
 */
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { SearchRelatedDiagnoses } from '@/Components'
import AddAdditionalDrugs from '@/Store/MedicalCase/Drugs/AddAdditionalDrugs'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import RemoveCustomDrugs from '@/Store/MedicalCase/Drugs/RemoveCustomDrugs'
import { _keys } from '@/Utils/Object'
import sortByLabel from '@/Utils/SortByLabel'

const SearchRelatedDiagnosesMedicalCaseContainer = ({
  navigation,
  route: {
    params: { drugId, drugName, drugType },
  },
}) => {
  // Define store and translation hooks
  const dispatch = useDispatch()

  // Get data from the store
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const { agreed, additional, custom } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )
  const mcDiagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  // Local state definition
  const [selectedDiagnoses, setSelectedDiagnoses] = useState({})
  const [originalSelectedDiagnoses, setOriginalSelectedDiagnoses] = useState({})

  const itemList = useMemo(() => {
    const diagnosisList = []
    for (const [diagnosisKey, diagnoses] of Object.entries({
      agreed,
      additional,
      custom,
    })) {
      Object.keys(diagnoses).forEach(diagnosisId => {
        if (diagnosisKey === 'custom') {
          diagnosisList.push({
            id: diagnosisId,
            key: diagnosisKey,
            label: diagnoses[diagnosisId].name,
            description: '',
            medias: [],
          })
        } else {
          diagnosisList.push({
            id: diagnosisId,
            key: diagnosisKey,
            ...nodes[diagnosisId],
          })
        }
      })
    }

    return sortByLabel(diagnosisList)
  }, [additional, agreed, custom])

  useEffect(() => {
    const tempSelected = {}
    for (const [diagnosisKey, diagnoses] of Object.entries({
      agreed,
      additional,
      custom,
    })) {
      Object.values(diagnoses).forEach(diagnosis => {
        const {
          agreed: agreedDrugs,
          additional: additionalDrugs,
          custom: customDrugs,
        } = diagnosis.drugs
        if (
          _keys({
            ...agreedDrugs,
            ...additionalDrugs,
          }).includes(drugId)
        ) {
          tempSelected[diagnosis.id] = { id: diagnosis.id, key: diagnosisKey }
        }
        // Custom drug in additional or agreed diagnosis
        if (Object.keys(customDrugs).includes(drugId)) {
          tempSelected[diagnosis.id] = { id: diagnosis.id, key: diagnosisKey }
        }
      })
    }
    setOriginalSelectedDiagnoses(tempSelected)
    setSelectedDiagnoses(tempSelected)
  }, [])

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    const originalIds = Object.keys(originalSelectedDiagnoses)

    let originalDuration = ''
    let originalFormulation = null

    if (Object.values(originalSelectedDiagnoses).length > 0) {
      const firstOriginalSelectedDiagnosis = Object.values(
        originalSelectedDiagnoses,
      )[0]
      const mcDiagnosis =
        mcDiagnoses[firstOriginalSelectedDiagnosis.key][
          firstOriginalSelectedDiagnosis.id
        ].drugs[drugType][drugId]

      originalDuration = mcDiagnosis.duration
      originalFormulation = mcDiagnosis.formulation_id
    }

    // Add new drugs
    Object.keys(selectedDiagnoses).forEach(diagnosisId => {
      if (!originalIds.includes(diagnosisId)) {
        if (drugType === 'custom') {
          dispatch(
            AddCustomDrugs.action({
              diagnosisKey: selectedDiagnoses[diagnosisId].key,
              diagnosisId: selectedDiagnoses[diagnosisId].id,
              drugId,
              drugContent: {
                id: drugId,
                name: drugName,
                duration: originalDuration,
                addedAt: Math.floor(new Date().getTime() / 1000),
              },
            }),
          )
        } else {
          dispatch(
            AddAdditionalDrugs.action({
              diagnosisKey: selectedDiagnoses[diagnosisId].key,
              diagnosisId: diagnosisId,
              newAdditionalDrug: {
                id: drugId,
                formulation_id: originalFormulation,
                duration: originalDuration,
                addedAt: Math.floor(new Date().getTime() / 1000),
              },
            }),
          )
        }
      }
    })

    // Remove old drugs
    originalIds.forEach(diagnosisId => {
      if (!Object.keys(selectedDiagnoses).includes(diagnosisId)) {
        const actionHash = {
          diagnosisKey: originalSelectedDiagnoses[diagnosisId].key,
          diagnosisId: originalSelectedDiagnoses[diagnosisId].id,
          drugId,
        }

        if (drugType === 'custom') {
          dispatch(RemoveCustomDrugs.action(actionHash))
        } else {
          dispatch(RemoveAdditionalDrugs.action(actionHash))
        }
      }
    })
    navigation.goBack()
  }

  return (
    <SearchRelatedDiagnoses
      navigation={navigation}
      handleApply={handleApply}
      selected={selectedDiagnoses}
      setSelected={setSelectedDiagnoses}
      itemList={itemList}
    />
  )
}

export default SearchRelatedDiagnosesMedicalCaseContainer
