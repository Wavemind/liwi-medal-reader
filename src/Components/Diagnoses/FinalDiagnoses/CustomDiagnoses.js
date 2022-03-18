/**
 * The external imports
 */
import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'react-native-uuid'
import { Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { RoundedButton, SelectedItem } from '@/Components'
import { useTheme } from '@/Theme'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import RemoveCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveCustomDiagnoses'

const CustomDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
    Colors,
    Components: { additionalSelect },
    Containers: { finalDiagnoses },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [value, setValue] = useState('')

  const custom = useSelector(state => state.medicalCase.item.diagnosis.custom)

  const listValues = useMemo(() => Object.values(custom), [custom])

  /**
   * Calls the handleAdd method from the props before resetting the input value
   */
  const addCustomDiagnosis = () => {
    const diagnosisId = uuid.v4()

    dispatch(
      AddCustomDiagnoses.action({
        diagnosisId,
        diagnosisContent: {
          id: diagnosisId,
          drugs: {},
          name: value,
        },
      }),
    )
    setValue('')
  }

  /**
   * Defines the correct handler for the remove item action
   * @param idToRemove
   */
  const removeCustomDiagnosis = idToRemove => {
    dispatch(
      RemoveCustomDiagnoses.action({
        diagnosisId: idToRemove,
      }),
    )
  }

  return (
    <View>
      {listValues.length > 0 && (
        <View style={additionalSelect.headerWrapper}>
          <View style={additionalSelect.headerSpacer} />
          <Text style={additionalSelect.durationLabel}>
            {t('containers.medical_case.duration_title')}
          </Text>
        </View>
      )}
      {listValues.length === 0 ? (
        <View>
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.diagnoses.no_custom')}
          </Text>
        </View>
      ) : (
        listValues.map((listItem, i) => (
          <SelectedItem
            key={`custom-${listItem.id}`}
            listItem={listItem}
            listObject={custom}
            isLast={i === listValues.length - 1}
            onRemovePress={removeCustomDiagnosis}
            labelMethod={() => listItem.name}
          />
        ))
      )}
      <View style={[Gutters.regularVMargin, finalDiagnoses.addCustomWrapper]}>
        <TextInput
          style={finalDiagnoses.addCustomInputText}
          onChangeText={setValue}
          value={value}
          keyboardType="default"
          placeholder={t(
            'containers.medical_case.diagnoses.custom_placeholder',
          )}
          placeholderTextColor={Colors.grey}
        />
        <RoundedButton
          label={t('actions.add')}
          icon="add"
          filled
          fullWidth={false}
          iconSize={FontSize.large}
          onPress={addCustomDiagnosis}
          disabled={value === ''}
        />
      </View>
    </View>
  )
}

export default CustomDiagnoses
