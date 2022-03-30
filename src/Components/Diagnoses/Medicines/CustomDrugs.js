/**
 * The external imports
 */
import React, { useState, useEffect, useMemo } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import { RoundedButton, Icon, CustomDrug } from '@/Components'

const CustomDrugs = ({ customDrugs }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Colors,
    Containers: { finalDiagnoses, medicines },
    Components: { additionalSelect },
  } = useTheme()

  const { t } = useTranslation()

  const [value, setValue] = useState('')
  const [unassignedDrugs, setUnassignedDrugs] = useState([])

  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  useEffect(() => {
    const newUnassignedDrugs = [...unassignedDrugs].filter(drug => {
      return !customDrugs.map(d => d.id).includes(drug.id)
    })
    setUnassignedDrugs(newUnassignedDrugs)
  }, [diagnoses])

  const orderedDrugs = useMemo(
    () => orderBy(customDrugs, drug => drug.addedAt, ['asc']),
    [customDrugs],
  )

  /**
   * Updates the customDrug in the local state
   */
  const updateCustomDrugs = () => {
    const drugId = uuid.v4()
    setUnassignedDrugs([
      ...unassignedDrugs,
      { id: drugId, label: value, diagnoses: [] },
    ])
    setValue('')
  }

  /**
   * Removes the drug from the unassignedDrugs state
   * @param drugId
   */
  const onRemovePress = drugId => {
    const newDrugs = [...unassignedDrugs]
    const indexToRemove = newDrugs.findIndex(drug => drug.id === drugId)
    if (indexToRemove > -1) {
      newDrugs.splice(indexToRemove, 1)
    }
    setUnassignedDrugs(newDrugs)
  }

  return (
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.drugs.custom')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {orderedDrugs.length === 0 && unassignedDrugs.length === 0 ? (
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.drugs.no_custom')}
          </Text>
        ) : (
          orderedDrugs.map(drug => (
            <CustomDrug key={`customDrug_${drug.id}`} drug={drug} />
          ))
        )}
      </View>
      {unassignedDrugs.map(unassignedDrug => (
        <View
          key={`unassignedDrug_${unassignedDrug.id}`}
          style={additionalSelect.addAdditionalWrapper}
        >
          <View style={medicines.drugTitleWrapper}>
            <Text style={medicines.drugTitle}>{unassignedDrug.label}</Text>
            <Text style={medicines.selectRelatedDiagnoses}>
              {t('containers.medical_case.drugs.select_related')}
            </Text>
            <TouchableOpacity onPress={() => onRemovePress(unassignedDrug.id)}>
              <Icon name="delete" size={FontSize.large} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={additionalSelect.addAdditionalButton}
            onPress={() =>
              navigate('SearchRelatedDiagnoses', {
                drugId: unassignedDrug.id,
                drugName: unassignedDrug.label,
                drugType: 'custom',
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
      <View style={[Gutters.regularHPadding, Gutters.regularVPadding]}>
        <View style={[Gutters.regularVMargin, finalDiagnoses.addCustomWrapper]}>
          <TextInput
            style={finalDiagnoses.addCustomInputText}
            onChangeText={setValue}
            value={value}
            keyboardType="default"
            placeholder={t('containers.medical_case.drugs.custom_placeholder')}
            placeholderTextColor={Colors.grey}
          />
          <RoundedButton
            label={t('actions.add')}
            icon="add"
            filled
            fullWidth={false}
            iconSize={FontSize.large}
            onPress={updateCustomDrugs}
            disabled={value === ''}
          />
        </View>
      </View>
    </View>
  )
}

export default CustomDrugs
