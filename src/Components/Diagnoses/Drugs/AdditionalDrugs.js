/**
 * The external imports
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { reworkAndOrderDrugs } from '@/Utils/Drug'
import { navigate } from '@/Navigators/Root'
import {
  Icon,
  DrugsAutocomplete,
  QuestionInfoButton,
  AdditionalDrug,
} from '@/Components'

const AdditionalDrugs = () => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Containers: { drugs, finalDiagnoses },
    Components: { additionalSelect },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  const [unassignedDrugs, setUnassignedDrugs] = useState([])

  const additionalDrugs = useMemo(
    () => reworkAndOrderDrugs('additional'),
    [diagnoses],
  )

  useEffect(() => {
    const newUnassignedDrugs = [...unassignedDrugs].filter(drug => {
      return !additionalDrugs.map(d => d.id).includes(drug.id)
    })
    setUnassignedDrugs(newUnassignedDrugs)
  }, [diagnoses])

  /**
   * Updates the additionalDrug in the local state
   * @param drugId
   * @param selectedId
   */
  const updateAdditionalDrugs = selectedId => {
    setUnassignedDrugs([...unassignedDrugs, { id: selectedId, diagnoses: [] }])
  }

  /**
   * Removes the drug from the unassignedDrugs state
   * @param drugId
   */
  const onRemovePress = drugId => {
    const newUnassignedDrugs = [...unassignedDrugs]
    const indexToRemove = newUnassignedDrugs.findIndex(
      drug => drug.id === drugId,
    )
    if (indexToRemove > -1) {
      newUnassignedDrugs.splice(indexToRemove, 1)
    }
    setUnassignedDrugs(newUnassignedDrugs)
  }

  return (
    <View style={drugs.wrapper}>
      <View style={drugs.headerWrapper}>
        <Text style={drugs.header}>
          {t('containers.medical_case.drugs.additional')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {additionalDrugs.length === 0 && unassignedDrugs.length === 0 && (
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.drugs.no_additional')}
          </Text>
        )}
        {additionalDrugs.map((drug, i) => (
          <AdditionalDrug
            key={`additionalDrug_${drug.id}`}
            drug={drug}
            isLast={i === Object.keys(additionalDrugs).length - 1}
          />
        ))}
        {unassignedDrugs.map((tempDrug, i) => (
          <View
            key={`tempDrug_${tempDrug.id}`}
            style={additionalSelect.addAdditionalWrapper}
          >
            <View style={drugs.drugTitleWrapper}>
              <Text style={drugs.drugTitle}>
                {translate(nodes[tempDrug.id].label)}
              </Text>
              <QuestionInfoButton nodeId={tempDrug.id} />
              <Text style={drugs.selectRelatedDiagnoses}>
                {t('containers.medical_case.drugs.select_related')}
              </Text>
              <TouchableOpacity onPress={() => onRemovePress(tempDrug.id)}>
                <Icon style={{}} name="delete" size={FontSize.large} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={additionalSelect.addAdditionalButton}
              onPress={() =>
                navigate('AdditionalSearchRelatedDiagnoses', {
                  drugId: tempDrug.id,
                })
              }
            >
              <Text style={additionalSelect.addAdditionalButtonText}>
                {t('containers.medical_case.drugs.related_placeholder')}
              </Text>
              <View style={additionalSelect.addAdditionalButtonCountWrapper}>
                <Text style={additionalSelect.addAdditionalButtonCountText}>
                  {tempDrug.diagnoses.length}
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
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        <DrugsAutocomplete updateAdditionalDrugs={updateAdditionalDrugs} />
      </View>
    </View>
  )
}

export default AdditionalDrugs
