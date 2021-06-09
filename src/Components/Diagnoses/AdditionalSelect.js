/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View, TextInput } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import { navigate } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const AdditionalSelect = ({
  listObject,
  listItemType,
  handleRemove,
  diagnosisId = null,
  diagnosisType = null,
  durationRequired = false,
  onUpdateDuration,
}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
    Containers: { medicalCaseFinalDiagnoses },
    Components: { additionalSelect },
  } = useTheme()

  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)

  const listValues = Object.values(listObject)

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
        <Text style={additionalSelect.durationLabel}>duration in days</Text>
      </View>
    )
  }

  /**
   * Renders the duration textInput
   * @returns {JSX.Element}
   */
  const renderDuration = itemId => {
    return (
      <View>
        <TextInput
          style={additionalSelect.durationInput}
          onChangeText={duration => onUpdateDuration(diagnosisId, itemId, duration)}
          value={listObject[itemId].duration}
          textAlign="center"
          keyboardType="default"
        />
      </View>
    )
  }

  return (
    <>
      {durationRequired && listValues.length > 0 && renderHeader()}
      {listValues.map((listItem, i) => (
        <View
          key={`additional-${listItem.id}`}
          style={medicalCaseFinalDiagnoses.newItemWrapper(
            i === listValues.length - 1,
          )}
        >
          <Text style={additionalSelect.itemLabel}>
            {translate(algorithm.nodes[listItem.id].label)}
          </Text>
          {durationRequired && renderDuration(listItem.id)}
          <TouchableOpacity onPress={() => removeItem(listItem.id)}>
            <Icon style={{}} name="delete" size={FontSize.regular} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={additionalSelect.addAdditionalButton}
        onPress={() => navigate('Additional', { diagnosisType, diagnosisId })}
      >
        <Text style={additionalSelect.addAdditionalButtonText}>
          {t('containers.medical_case.diagnoses.additional_placeholder', {
            item: listItemType,
          })}
        </Text>
        <View style={additionalSelect.addAdditionalButtonCountWrapper}>
          <Text style={additionalSelect.addAdditionalButtonCountText}>
            {listValues.length}
          </Text>
        </View>
        <Icon
          style={Gutters.regularLMargin}
          name="right-arrow"
          size={FontSize.large}
        />
      </TouchableOpacity>
    </>
  )
}

export default AdditionalSelect
