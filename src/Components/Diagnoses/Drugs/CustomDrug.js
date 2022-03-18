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
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'

const CustomDrug = ({ drug, isLast }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Containers: { drugs },
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
        ChangeCustomDrugDuration.action({
          diagnosisKey: diagnosis.key,
          diagnosisId: diagnosis.id,
          drugId: drug.id,
          duration,
        }),
      )
    })
  }

  return (
    <View style={drugs.additionalWrapper}>
      <View style={drugs.drugTitleWrapper}>
        <Text style={drugs.drugTitle}>{drug.label}</Text>
        <View style={additionalSelect.durationWrapper}>
          <TextInput
            style={additionalSelect.durationInput}
            onChangeText={duration => onUpdateDuration(duration)}
            value={drug.duration}
            textAlign="center"
            keyboardType="default"
          />
        </View>
        <TouchableOpacity onPress={() => onRemovePress(drug.id)}>
          <Icon name="delete" size={FontSize.large} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={drugs.indication}>
          {t('containers.medical_case.drugs.indication')}
        </Text>
        {drug.diagnoses.map(diagnosis => (
          <Text
            key={`diagnosisDrug_${diagnosis.id}`}
            style={drugs.drugDescription}
          >
            - {diagnosis.label}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={additionalSelect.addAdditionalButton}
        onPress={() =>
          navigate('CustomSearchRelatedDiagnoses', {
            drugId: drug.id,
            drugName: drug.label,
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
