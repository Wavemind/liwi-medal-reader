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
import { Icon, SelectedItem } from '@/Components'
import { navigate } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const AdditionalSelect = ({
  listObject,
  listItemLabel,
  handleRemove,
  diagnosisId = null,
  diagnosisKey = null,
  withDuration = false,
  onUpdateDuration,
}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
    Components: { additionalSelect },
    Containers: { finalDiagnoses },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

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

  return (
    <View>
      {listValues.length === 0 && (
        <View>
          <Text style={finalDiagnoses.noItemsText}>
            {t(
              `containers.medical_case.${
                diagnosisId ? 'drugs' : 'diagnoses'
              }.no_additional`,
            )}
          </Text>
        </View>
      )}
      {withDuration && listValues.length > 0 && (
        <View style={additionalSelect.headerWrapper}>
          <View style={additionalSelect.headerSpacer} />
          <Text style={additionalSelect.durationLabel}>
            {t('containers.medical_case.duration_title')}
          </Text>
        </View>
      )}
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
          labelMethod={() => translate(nodes[listItem.id].label)}
        />
      ))}
      <TouchableOpacity
        style={additionalSelect.addAdditionalButton}
        onPress={() => navigate('SearchAdditional', { diagnosisId })}
      >
        <Text style={additionalSelect.addAdditionalButtonText}>
          {t('containers.medical_case.diagnoses.additional_placeholder', {
            item: listItemLabel,
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
    </View>
  )
}

export default AdditionalSelect
