/**
 * The external imports
 */
import React from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { navigate } from '@/Navigators/Root'
import RemoveCustomDrugs from '@/Store/MedicalCase/Drugs/RemoveCustomDrugs'
import ChangeDrugDuration from '@/Store/MedicalCase/Drugs/ChangeDrugDuration'
import { formatDuration } from '@/Utils/Drug'

const CustomDrug = ({ drug }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Containers: { medicines },
    Components: { additionalSelect },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  /**
   * Removes the additional drug from all of the related diagnoses
   */
  const onRemovePress = () => {
    drug.diagnoses.forEach(diagnosis => {
      dispatch(
        RemoveCustomDrugs.action({
          diagnosisKey: diagnosis.key,
          diagnosisId: diagnosis.id,
          drugId: drug.id,
        }),
      )
    })
  }

  /**
   * Updates the duration of the additional drug
   * @param {*} duration string
   */
  const onUpdateDuration = duration => {
    drug.diagnoses.forEach(diagnosis => {
      dispatch(
        ChangeDrugDuration.action({
          drugKey: 'custom',
          diagnosisKey: diagnosis.key,
          diagnosisId: diagnosis.id,
          drugId: drug.id,
          duration: formatDuration(duration),
        }),
      )
    })
  }

  return (
    <View style={medicines.additionalWrapper}>
      <View style={medicines.drugTitleWrapper}>
        <Text style={medicines.drugTitle}>{drug.label}</Text>
        <View style={additionalSelect.durationWrapper}>
          <Text style={additionalSelect.durationLabel}>
            {t('formulations.drug.duration')}
          </Text>
          <TextInput
            style={additionalSelect.durationInput}
            onChangeText={duration => onUpdateDuration(duration)}
            value={drug.duration ? String(drug.duration) : ''}
            textAlign="center"
            keyboardType="number-pad"
          />
        </View>
        <TouchableOpacity onPress={onRemovePress}>
          <Icon name="delete" size={FontSize.large} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={medicines.indication}>
          {t('containers.medical_case.drugs.indication')}
        </Text>
        {drug.diagnoses.map(diagnosis => (
          <Text
            key={`diagnosisDrug_${diagnosis.id}`}
            style={medicines.drugDescription}
          >
            - {diagnosis.label}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={additionalSelect.addAdditionalButton}
        onPress={() =>
          navigate('SearchRelatedDiagnoses', {
            drugId: drug.id,
            drugName: drug.label,
            drugType: 'custom',
          })
        }
      >
        <Text style={additionalSelect.addAdditionalButtonText}>
          {t('containers.medical_case.drugs.related_placeholder')}
        </Text>
        <View style={additionalSelect.addAdditionalButtonCountWrapper}>
          <Text style={additionalSelect.addAdditionalButtonCountText}>
            {drug.diagnoses.length}
          </Text>
        </View>
        <Icon
          style={Gutters.regularLMargin}
          name="right-arrow"
          size={FontSize.large}
        />
      </TouchableOpacity>
    </View>
  )
}

export default CustomDrug
