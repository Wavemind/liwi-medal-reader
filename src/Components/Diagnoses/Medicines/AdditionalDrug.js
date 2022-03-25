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
import { Icon, QuestionInfoButton, FormulationsPicker } from '@/Components'
import { navigate } from '@/Navigators/Root'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import ChangeDrugDuration from '@/Store/MedicalCase/Drugs/ChangeDrugDuration'

const AdditionalDrug = ({ drug }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Containers: { formulations, drugs },
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
        RemoveAdditionalDrugs.action({
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
    const regWithComma = /^[0-9,]+$/

    // Replace comma with dot
    if (regWithComma.test(duration)) {
      duration = duration.replace(',', '.')
    }

    // Remove char that are not number or dot
    duration = duration.replace(/[^0-9.]/g, '')

    // Parse to float if value is not empty and last char is not dot
    if (duration !== '' && duration.charAt(duration.length - 1) !== '.') {
      duration = parseFloat(duration)
    }

    drug.diagnoses.forEach(diagnosis => {
      dispatch(
        ChangeDrugDuration.action({
          drugKey: 'additional',
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
        <QuestionInfoButton nodeId={drug.id} />
        <View style={additionalSelect.durationWrapper}>
          <TextInput
            style={additionalSelect.durationInput}
            onChangeText={duration => onUpdateDuration(duration)}
            value={drug.duration ? String(drug.duration) : ''}
            textAlign="center"
            keyboardType="decimal-pad"
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
          navigate('SearchRelatedDiagnoses', {
            drugId: drug.id,
            drugType: 'additional',
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
      <View style={formulations.pickerWrapper}>
        <FormulationsPicker drug={drug} />
      </View>
    </View>
  )
}

export default AdditionalDrug