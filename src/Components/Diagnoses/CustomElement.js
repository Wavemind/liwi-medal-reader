/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { RoundedButton } from '@/Components'
import { useTheme } from '@/Theme'
import AdditionalItem from '@/Components/Diagnoses/AdditionalItem'

const CustomElement = ({
  listObject,
  handleAdd,
  handleRemove,
  diagnosisId = null,
  withDuration = false,
  onUpdateDuration = null,
}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
    Components: { additionalSelect },
    Containers: { finalDiagnoses },
  } = useTheme()

  const { t } = useTranslation()

  const [value, setValue] = useState('')

  const listValues = Object.values(listObject)

  /**
   * Calls the handleAdd method from the props before resetting the input value
   */
  const addItem = () => {
    if (diagnosisId) {
      handleAdd(diagnosisId, value)
    } else {
      handleAdd(value)
    }
    setValue('')
  }

  /**
   * Defines the correct handler for the remove item action
   * @param idToRemove
   */
  const removeItem = idToRemove => {
    if (diagnosisId) {
      handleRemove(diagnosisId, idToRemove)
    } else {
      handleRemove(idToRemove)
    }
  }

  /**
   * Renders the duration header
   * @returns {JSX.Element}
   */
  const renderHeader = () => {
    return (
      <View style={additionalSelect.headerWrapper}>
        <View style={additionalSelect.headerSpacer} />
        <Text style={additionalSelect.durationLabel}>{t('containers.medical_case.duration_title')}</Text>
      </View>
    )
  }

  return (
    <>
      {withDuration && listValues.length > 0 && renderHeader()}
      {listValues.map((listItem, i) => (
        <AdditionalItem
          key={`additional-${listItem.id}`}
          listItem={listItem}
          diagnosisId={diagnosisId}
          listObject={listObject}
          isLast={i === listValues.length - 1}
          withDuration={withDuration}
          onRemovePress={removeItem}
          onUpdateDuration={onUpdateDuration}
          labelMethod={() => listItem.name}
        />
      ))}
      <View style={[Gutters.regularVMargin, finalDiagnoses.addCustomWrapper]}>
        <TextInput
          style={finalDiagnoses.addCustomInputText}
          onChangeText={setValue}
          value={value}
          keyboardType="default"
          placeholder={t(
            `containers.medical_case.${
              diagnosisId ? 'drugs' : 'diagnoses'
            }.custom_placeholder`,
          )}
        />
        <RoundedButton
          label={t('actions.add')}
          icon="add"
          filled
          fullWidth={false}
          iconSize={FontSize.large}
          onPress={addItem}
          disabled={value === ''}
        />
      </View>
    </>
  )
}

export default CustomElement
