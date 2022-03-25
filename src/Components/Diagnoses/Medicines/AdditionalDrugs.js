/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import {
  Icon,
  DrugsAutocomplete,
  QuestionInfoButton,
  AdditionalDrug,
} from '@/Components'

const AdditionalDrugs = ({ additionalDrugs }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Containers: { medicines, finalDiagnoses },
    Components: { additionalSelect },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)
  const [unassignedDrugs, setUnassignedDrugs] = useState([])

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
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.drugs.additional')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {additionalDrugs.length === 0 && unassignedDrugs.length === 0 ? (
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.drugs.no_additional')}
          </Text>
        ) : (
          additionalDrugs.map(drug => (
            <AdditionalDrug key={`additionalDrug_${drug.id}`} drug={drug} />
          ))
        )}
        {unassignedDrugs.map(unassignedDrug => (
          <View
            key={`unassignedDrug_${unassignedDrug.id}`}
            style={additionalSelect.addAdditionalWrapper}
          >
            <View style={medicines.drugTitleWrapper}>
              <Text style={medicines.drugTitle}>
                {translate(nodes[unassignedDrug.id].label)}
              </Text>
              <QuestionInfoButton nodeId={unassignedDrug.id} />
              <Text style={medicines.selectRelatedDiagnoses}>
                {t('containers.medical_case.drugs.select_related')}
              </Text>
              <TouchableOpacity
                onPress={() => onRemovePress(unassignedDrug.id)}
              >
                <Icon style={{}} name="delete" size={FontSize.large} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={additionalSelect.addAdditionalButton}
              onPress={() =>
                navigate('SearchRelatedDiagnoses', {
                  drugId: unassignedDrug.id,
                  drugType: 'additional',
                })
              }
            >
              <Text style={additionalSelect.addAdditionalButtonText}>
                {t('containers.medical_case.drugs.related_placeholder')}
              </Text>
              <View style={additionalSelect.addAdditionalButtonCountWrapper}>
                <Text style={additionalSelect.addAdditionalButtonCountText}>
                  {unassignedDrug.diagnoses.length}
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
