/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import { RoundedButton, QuestionInfoButton, Icon } from '@/Components'
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import RemoveCustomDrugs from '@/Store/MedicalCase/Drugs/RemoveCustomDrugs'

const CustomDrugs = () => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Colors,
    Containers: { finalDiagnoses, drugs },
    Components: { additionalSelect },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [value, setValue] = useState('')
  const [tempDrugs, setTempDrugs] = useState([])

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const customDiagnoses = useSelector(
    state => state.medicalCase.item.diagnosis.custom,
  )

  /**
   * Handles the addition of a new custom drug
   * @param diagnosisId
   * @param value
   */
  const addCustomDrug = (diagnosisId, value) => {
    const drugId = uuid.v4()
    dispatch(
      AddCustomDrugs.action({
        diagnosisId,
        drugId,
        drugContent: {
          id: drugId,
          name: value,
          duration: '',
        },
      }),
    )
  }

  /**
   * Handles the removal of a custom diagnosis
   * @param diagnosisId
   * @param drugId
   */
  const removeCustomDrug = (diagnosisId, drugId) => {
    dispatch(
      RemoveCustomDrugs.action({
        diagnosisId,
        drugId,
      }),
    )
  }

  /**
   * Updates the selected custom drug duration
   * @param diagnosisId
   * @param drugId
   * @param duration
   */
  const updateCustomDrugDuration = (diagnosisId, drugId, duration) => {
    dispatch(
      ChangeCustomDrugDuration.action({
        diagnosisId,
        drugId,
        duration,
      }),
    )
  }

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
              navigate('SearchRelatedDiagnoses', { drugId: tempDrug.id })
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
