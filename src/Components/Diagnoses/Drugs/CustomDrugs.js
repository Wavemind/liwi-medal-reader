/**
 * The external imports
 */
import React, { useState, useMemo } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import { reworkAndOrderDrugs } from '@/Utils/Drug'
import { RoundedButton, Icon, CustomDrug } from '@/Components'

const CustomDrugs = () => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Colors,
    Containers: { finalDiagnoses, drugs },
    Components: { additionalSelect },
  } = useTheme()

  const { t } = useTranslation()

  const [value, setValue] = useState('')
  const [tempDrugs, setTempDrugs] = useState([])

  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  const customDrugs = useMemo(() => reworkAndOrderDrugs('custom'), [diagnoses])

  /**
   * Updates the customDrug in the local state
   */
  const updateCustomDrugs = () => {
    const drugId = uuid.v4()
    setTempDrugs([...tempDrugs, { id: drugId, label: value, diagnoses: [] }])
    setValue('')
  }

  /**
   * Removes the drug from the tempDrugs state
   * @param drugId
   */
  const onRemovePress = drugId => {
    const newDrugs = [...tempDrugs]
    const indexToRemove = newDrugs.findIndex(drug => drug.id === drugId)
    if (indexToRemove > -1) {
      newDrugs.splice(indexToRemove, 1)
    }
    setTempDrugs(newDrugs)
  }

  return (
    <View style={drugs.wrapper}>
      <View style={drugs.headerWrapper}>
        <Text style={drugs.header}>
          {t('containers.medical_case.drugs.custom')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {customDrugs.length === 0 && tempDrugs.length === 0 ? (
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.drugs.no_custom')}
          </Text>
        ) : (
          customDrugs.map((drug, i) => (
            <CustomDrug
              key={`customDrug_${drug.id}`}
              drug={drug}
              isLast={i === Object.keys(customDrugs).length - 1}
            />
          ))
        )}
      </View>
      {tempDrugs.map((tempDrug, i) => (
        <View
          key={`tempDrug_${tempDrug.id}`}
          style={additionalSelect.addAdditionalWrapper}
        >
          <View style={drugs.drugTitleWrapper}>
            <Text style={drugs.drugTitle}>{tempDrug.label}</Text>
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
              navigate('CustomSearchRelatedDiagnoses', {
                drugId: tempDrug.id,
                drugName: tempDrug.label,
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
