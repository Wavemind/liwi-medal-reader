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
import AddAdditionalDrugs from '@/Store/MedicalCase/Drugs/AddAdditionalDrugs'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import { _keys } from '@/Utils/Object'

const AdditionalSearchRelatedDiagnosesMedicalCaseContainer = ({
  navigation,
  route: {
    params: { drugId },
  },
}) => {
  // Define store and translation hooks
  const dispatch = useDispatch()

  // Get data from the store
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const { agreed, additional } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )

  // Local state definition
  const [selected, setSelected] = useState({})
  const [originalSelected, setOriginalSelected] = useState({})

  const itemList = useMemo(() => {
    const diagnosisList = []
    for (const [key, value] of Object.entries({ agreed, additional })) {
      _keys(value).forEach(diagnosis => {
        diagnosisList.push({
          id: diagnosis,
          key,
          ...nodes[diagnosis],
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
  }, [additional, agreed])

  useEffect(() => {
    const tempSelected = {}
    for (const [key, diagnoses] of Object.entries({ agreed, additional })) {
      Object.values(diagnoses).forEach(diagnosis => {
        const { agreed: agreedDrugs, additional: additionalDrugs } =
          diagnosis.drugs
        if (_keys({ ...agreedDrugs, ...additionalDrugs }).includes(drugId)) {
          tempSelected[diagnosis.id] = { id: diagnosis.id, key }
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
    const originalIds = _keys(originalSelected)

    Object.values(selected).forEach(diagnosis => {
      if (!originalIds.includes(diagnosis.id)) {
        dispatch(
          AddAdditionalDrugs.action({
            diagnosisKey: diagnosis.key,
            diagnosisId: diagnosis.id,
            newAdditionalDrug: {
              id: drugId,
              formulation_id: null,
              addedAt: Math.floor(new Date().getTime() / 1000),
            },
          }),
        )
      }
    })
    originalIds.forEach(diagnosisId => {
      if (!_keys(selected).includes(diagnosisId)) {
        dispatch(
          RemoveAdditionalDrugs.action({
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

export default AdditionalSearchRelatedDiagnosesMedicalCaseContainer
