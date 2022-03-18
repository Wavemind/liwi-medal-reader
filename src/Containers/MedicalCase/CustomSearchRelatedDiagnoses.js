/**
 * The external imports
 */
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { SearchRelatedDiagnoses } from '@/Components'
import { translate } from '@/Translations/algorithm'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import RemoveCustomDrugs from '@/Store/MedicalCase/Drugs/RemoveCustomDrugs'

const CustomSearchRelatedDiagnosesMedicalCaseContainer = ({
  navigation,
  route: {
    params: { drugId, drugName },
  },
}) => {
  // Define store and translation hooks
  const dispatch = useDispatch()

  // Get data from the store
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const { custom, additional } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )

  // Local state definition
  const [selected, setSelected] = useState({})
  const [originalSelected, setOriginalSelected] = useState({})

  const itemList = useMemo(() => {
    const diagnosisList = []
    for (const [key, diagnoses] of Object.entries({ custom, additional })) {
      Object.values(diagnoses).forEach(diagnosis => {
        const itemId =
          key === 'custom' ? diagnosis.id : parseInt(diagnosis.id, 10)
        diagnosisList.push({
          id: itemId,
          key,
          label: key === 'custom' ? diagnosis.name : nodes[itemId].label,
          description: key === 'custom' ? '' : nodes[itemId].description,
          medias: key === 'custom' ? [] : nodes[itemId].medias,
        })
      })
    }
    return diagnosisList.sort((a, b) => {
      return translate(a.label) > translate(b.label)
        ? 1
        : translate(b.label) > translate(a.label)
        ? -1
        : 0
    })
  }, [additional, custom])

  useEffect(() => {
    const tempSelected = {}
    for (const [key, diagnoses] of Object.entries({ custom, additional })) {
      Object.values(diagnoses).forEach(diagnosis => {
        if (key === 'custom') {
          if (Object.keys(diagnosis.drugs).includes(drugId)) {
            tempSelected[diagnosis.id] = { id: diagnosis.id, key }
          }
        } else {
          if (Object.keys(diagnosis.drugs.custom).includes(drugId)) {
            tempSelected[diagnosis.id] = { id: diagnosis.id, key }
          }
        }
      })
    }
    setOriginalSelected(tempSelected)
    setSelected(tempSelected)
  }, [])

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    const originalIds = Object.keys(originalSelected)

    Object.keys(selected).forEach(diagnosis => {
      if (!originalIds.includes(selected[diagnosis].id)) {
        dispatch(
          AddCustomDrugs.action({
            diagnosisKey: selected[diagnosis].key,
            diagnosisId: selected[diagnosis].id,
            drugId,
            drugContent: {
              id: drugId,
              name: drugName,
              duration: null,
              addedAt: Math.floor(new Date().getTime() / 1000),
            },
          }),
        )
      }
    })
    originalIds.forEach(diagnosisId => {
      if (!Object.keys(selected).includes(diagnosisId)) {
        dispatch(
          RemoveCustomDrugs.action({
            diagnosisKey: originalSelected[diagnosisId].key,
            diagnosisId: originalSelected[diagnosisId].id,
            drugId,
          }),
        )
      }
    })
    navigation.goBack()
  }

  return (
    <SearchRelatedDiagnoses
      navigation={navigation}
      handleApply={handleApply}
      selected={selected}
      setSelected={setSelected}
      itemList={itemList}
    />
  )
}

export default CustomSearchRelatedDiagnosesMedicalCaseContainer
