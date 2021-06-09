/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import { navigate } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import SelectedItem from '@/Components/Diagnoses/SelectedItem'

const AdditionalSelect = ({
  listObject,
  listItemType,
  handleRemove,
  diagnosisId = null,
  diagnosisType = null,
  withDuration = false,
  onUpdateDuration,
}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
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

  return (
    <>
      {withDuration && listValues.length > 0 && renderHeader()}
      {listValues.map((listItem, i) => (
        <SelectedItem
          key={`additional-${listItem.id}`}
          listItem={listItem}
          diagnosisId={diagnosisId}
          listObject={listObject}
          isLast={i === listValues.length - 1}
          withDuration={withDuration}
          onRemovePress={removeItem}
          onUpdateDuration={onUpdateDuration}
          labelMethod={() => translate(algorithm.nodes[listItem.id].label)}
        />
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
