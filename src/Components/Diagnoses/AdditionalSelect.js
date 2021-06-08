import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Icon } from '@/Components'
import { navigate } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const AdditionalSelect = ({
  list,
  listItemType,
  handleRemove,
  diagnosisId = null,
  diagnosisType = null,
}) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Gutters,
    FontSize,
    Containers: { medicalCaseFinalDiagnoses },
  } = useTheme()

  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)

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
    <>
      {list.map((listItem, i) => (
        <View
          key={`additional-${listItem.id}`}
          style={medicalCaseFinalDiagnoses.newItemWrapper(
            i === list.length - 1,
          )}
        >
          <Text style={Fonts.textSmall}>
            {translate(algorithm.nodes[listItem.id].label)}
          </Text>
          <TouchableOpacity onPress={() => removeItem(listItem.id)}>
            <Icon style={{}} name="delete" size={FontSize.regular} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={medicalCaseFinalDiagnoses.addAdditionalButton}
        onPress={() => navigate('Additional', { diagnosisType, diagnosisId })}
      >
        <Text style={medicalCaseFinalDiagnoses.addAdditionalButtonText}>
          {t('containers.medical_case.diagnoses.additional_placeholder', {
            item: listItemType,
          })}
        </Text>
        <View style={medicalCaseFinalDiagnoses.addAdditionalButtonCountWrapper}>
          <Text style={medicalCaseFinalDiagnoses.addAdditionalButtonCountText}>
            {Object.values(list).length}
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
